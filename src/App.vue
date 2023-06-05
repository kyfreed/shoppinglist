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
	}

	async function deleteItem(itemId) {
		const { error } = await supabase.from("shoppinglist").delete().eq('id', itemId)
	}

	onMounted(() => {
		getShoppingList()
	})
	</script>

	<template>
		<div class="list-wrapper">
			<tabs>
				<tab v-for="store in stores" :key="store.store_name" :name="store.store_name">
					<ul>
						<list-item 
						v-for="item in shoppingList[store.store_name]" 
						:key="item.id"
						:name="item.name"
						@delete-item="deleteItem(item.id)"
						/>
					</ul>
				</tab>
			</tabs>
			<input type="text" v-model="newItem">
			<button @click="addItem">Add item</button>
			<br>
			<label for="stores">
			<select id="stores" v-model="storeSelection">
				<option v-for="store in storeMenu">{{ store }}</option>
			</select>
			<input type="text" v-model="newStore" v-show="storeSelection == 'New store'">
		</label>
		</div>
	</template>

<style>
	* {
		font-size: 18px;
	}

	.list-wrapper {
		width: 50%;
		margin: auto;
	}
</style>
