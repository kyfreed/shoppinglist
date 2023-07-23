	<script setup>
	import { ref, onMounted } from 'vue'
	import { supabase } from './lib/supabaseClient'

	const items = ref([])
	const newItem = ref("")
	const storeSelection = ref("")
	const newStore = ref("")
	const stores = ref([])
	const shoppingList = ref({})
	const storeNames = ref([])
	const tab = ref("")
	const form = ref(null)
	const rules = ref([
		value => {
			if(value) return true

			return "You must enter a store name."
		}
	])

	const channel = supabase
		.channel('table_db_changes')
		.on(
			'postgres_changes',
			{
				event: '*',
				schema: 'public',
				table: 'shoppinglist',
			},
			(payload) => getShoppingList()
		)
		.subscribe()

	async function getShoppingList() {
		const { data:itemList } = await supabase.from('shoppinglist').select()
		items.value = itemList

		const { data:storeList } = await supabase.from('distinct_stores').select()
		stores.value = storeList

		storeNames.value = []

		stores.value.forEach((store) => {
			shoppingList.value[store.store_name] = []
			storeNames.value.push(store.store_name)
			items.value.forEach((item) => {
				if(item.store_name == store.store_name) {
					shoppingList.value[store.store_name].push(item)
				}
			});
 		});
	}

	async function addItem() {
		const { valid } = await form.value.validate()
		if(valid){
			const { error } = await supabase.from("shoppinglist").insert({name: newItem.value, store_name: storeSelection.value})
			newItem.value = ""
			newStore.value = ""
		}

	}

	async function deleteItem(itemId) {
		const { error } = await supabase.from("shoppinglist").delete().eq('id', itemId)
	}

	onMounted(() => {
		getShoppingList()
	})
	</script>

	<template>
		<v-card>
			<v-tabs 
			v-model="tab" 
			bg-color="#2b337f"
			show-arrows>
				<v-tab v-for="store in stores" :value="store.store_name" class="text-white">{{ store.store_name }}</v-tab>
			</v-tabs>

			<v-card-text>
				<v-window v-model="tab">
					<v-window-item v-for="store in stores" :value="store.store_name">
						<ul>
							<list-item 
							v-for="item in shoppingList[store.store_name]" 
							:key="item.id"
							:name="item.name"
							@delete-item="deleteItem(item.id)"
							/>
						</ul>
					</v-window-item>
				</v-window>
			</v-card-text>
		</v-card>
		<v-form @submit.prevent="addItem" ref="form">
			<v-text-field label="Item to add" style="width: 300px;" v-model="newItem"></v-text-field>
			<v-btn type="submit">Add item</v-btn>
			<v-combobox label="Store" style="width: 300px;" v-model="storeSelection" :items="storeNames" :rules="rules"></v-combobox>
		</v-form>
		<br>
		<br>
	</template>

<style>
	* {
		font-size: 18px;
	}
</style>
