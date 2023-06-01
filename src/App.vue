  <script setup>
  import { ref, onMounted } from 'vue'
  import { supabase } from './lib/supabaseClient'

  const shoppingList = ref([])
  const newItem = ref("")

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
    const { data } = await supabase.from('shoppinglist').select()
    shoppingList.value = data
  }

  async function addItem() {
  	const { error } = await supabase.from("shoppinglist").insert({name: newItem.value})
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
    <div id="list-wrapper">
      <ul>
        <list-item 
          v-for="item in shoppingList" 
          :key="item.id"
          :name="item.name"
          @delete-item="deleteItem(item.id)"
          />
      </ul>
      <input type="text" v-model="newItem">
      <button @click="addItem">Add item</button>
    </div>
  </template>

<style>
  * {
    font-size: 18px;
  }

  #list-wrapper {
    width: 50%;
    margin: auto;
  }
</style>
