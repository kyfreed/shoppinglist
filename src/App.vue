  <script setup>
  import { ref, onMounted } from 'vue'
  import { supabase } from './lib/supabaseClient'

  const shoppingList = ref([])

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

  onMounted(() => {
    getShoppingList()
  })
  </script>

  <template>
    <ul>
      <li v-for="item in shoppingList" :key="item.id">{{ item.name }}</li>
    </ul>

  </template>

<style></style>
