	<script setup>
	import { ref, onMounted } from 'vue'
	import { supabase } from './lib/supabaseClient'

	const items = ref([])
	const newItem = ref("")
	const storeSelection = ref("")
	const newStore = ref("")
	const stores = ref([])
	const shoppingList = ref({})
	const storeMenu = ref([])
	const tab = ref("")

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

		storeMenu.value = ["New store"]

		stores.value.forEach((store) => {
			shoppingList.value[store.store_name] = []
			storeMenu.value.push(store.store_name)
			items.value.forEach((item) => {
				if(item.store_name == store.store_name) {
					shoppingList.value[store.store_name].push(item)
				}
			});
 		});


		console.log(shoppingList.value)

	}

	async function addItem() {
		const { error } = await supabase.from("shoppinglist").insert({name: newItem.value, store_name: (storeSelection.value == "New store" ? newStore.value : storeSelection.value)})
		newItem.value = ""
		newStore.value = ""
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
		<v-text-field label="Item to add" class="w-50" v-model="newItem"></v-text-field>
		<v-btn @click="addItem">Add item</v-btn>
		<br>
		<br>
		<v-select label="Store" class="w-50" v-model="storeSelection" :items="storeMenu"></v-select>
		<v-text-field label="Store name" class="w-50" v-model="newStore" v-show="storeSelection == 'New store'"></v-text-field>
	</template>

<style>
	* {
		font-size: 18px;
	}
</style>
