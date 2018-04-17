<template>
  <div style="margin-bottom:120px;">


<loading margin="120px auto" v-show="loading" />
<datatable 
  :customButtons="customButtons"
  style="margin-top:60px" 
  v-show="!loading" 
  @row-click="onRowClick" 
  title="Sites" 
  :perPage="[10, 25, 50, 100, 500]" 
  :defaultPerPage="10" 
  :exportable="false"
  :printable="false" 
  :columns="columns" 
  :rows="rows" 
/>



<div ref="editModal" class="modal">
  <div class="modal-content">
    <h4>Edit Site</h4>
    <div class="row">
      <loading margin="100px auto" v-show="editSubmitReq" />
      <form class="col s12" @submit.prevent="onEditSubmit" v-show="!editSubmitReq">
        <div class="row">
          <div v-for="(obj, key) in editSite" class="input-field col s6">
            <input :placeholder="obj.label" :disabled="key == 'site'" class="validate" :id="'f-'+key" type="text" :value="obj.value"  :name="key" :required="key == 'site' || key == 'name' || key == 'category'" >
            <label :for="'f-'+key">{{ obj.label }}</label>
          </div>
        </div>
        <div class="right-align"> 
          <button type="button" @click.prevent="onDeleteSite" class="waves-effect waves-light red btn">Delete Site</button>
          <button type="submit" class="waves-effect waves-light btn">Update</button> 
        </div>  
      </form>
    </div>
  </div>
</div>


<div ref="addModal" class="modal">
  <div class="modal-content">
    <h4>Add Site</h4>
    <div class="row">
      <loading margin="100px auto" v-show="addSubmitReq" />
      <form class="col s12" @submit.prevent="onAddSubmit" v-show="!addSubmitReq">
        <div class="row">
          <div class="input-field col s6">
            <input placeholder="Site" class="validate" id="af-site" type="text"  name="site" required="required" >
            <label for="af-site">Site</label>
          </div>
          <div class="input-field col s6">
            <input placeholder="Name" class="validate" id="af-name" type="text"  name="name" required="required" >
            <label for="af-name">Name</label>
          </div>
          <div class="input-field col s6">
            <input placeholder="Category" class="validate" id="af-category" type="text"  name="category" required="required" >
            <label for="af-category">Category</label>
          </div>
          <div class="input-field col s6">
            <input placeholder="Date Launched" class="validate" id="af-date_launched" type="text"  name="date_launched" >
            <label for="af-date_launched">Date Launched</label>
          </div>
          <div class="input-field col s6">
            <input placeholder="Description" class="validate" id="af-description" type="text"  name="description" >
            <label for="af-description">Description</label>
          </div>
        </div>
        <div class="right-align">
          <button type="submit" class="waves-effect waves-light btn">Add</button>
        </div>  
      </form>
    </div>
  </div>
</div>


</div>
</template>

<style scoped>
  .material-table table{
    width: 100%;
  }
</style>


<script>
  import Panel from './shared/Panel'
  import Loading from './shared/Loading'
  import DataTable from 'vue-materialize-datatable';
  

  export default {
    components: { appPanel: Panel, Loading, datatable: DataTable },
    methods: {
      onRowClick(row) {
        this.editSite = {};
        const keys = ['site','name', 'category', 'description', 'date_launched'];
        this.keys.forEach( key =>{
          
         if($.inArray(key, keys)>-1){
            let label = this.columns.filter((el)=>{ return el.field == key; })[0].label;
            let tmp = {
              label: label,
              value: row[key] || null
            }; 
            this.editSite[key] = tmp;
          }
          
        })


        setTimeout(()=>{
          $(this.$refs.editModal).find('input').change();
          $(this.$refs.editModal).modal('open');
        }, 100);

        
      },
      onEditSubmit(){
       
        const data = {};
        $('form', this.$refs.editModal).find('input').each( function(){
          data[$(this).attr('name')] = $(this).val()
        })

        if(!this.$root.Helper.validUrl(data.site)){
          alert('Invalid Site Url (https://example.com/)')
          return false;
        }
        else{
          data.site.replace(/\/$/,'')
        }
        /*if(!this.$root.Helper.validDate(data.date_launched)){
          alert('Invalid Date Launched  (2018-01-01)')
          return false;
        }*/

         this.editSubmitReq = true;
        this.$root.Api.post('sites', data).then( res => {
          this.editSubmitReq = false;
          this.updateSiteList();
          $(this.$refs.editModal).modal('close');
        }, () => this.editSubmitReq = false )
      },
      onAddSubmit(){
        
        const data = {};
        $('form', this.$refs.addModal).find('input').each( function(){
          data[$(this).attr('name')] = $(this).val()
        })

        if(!this.$root.Helper.validUrl(data.site)){
          alert('Invalid Site Url (https://example.com/)')
          return false;
        }
        else{
          data.site.replace(/\/$/,'')
        }
        /*if(!this.$root.Helper.validDate(data.date_launched)){
          alert('Invalid Date Launched  (2018-01-01)')
          return false;
        }*/

        this.addSubmitReq = true;
        this.$root.Api.post('sites', data).then( res => {
          this.addSubmitReq = false;
          this.updateSiteList();
          $(this.$refs.addModal).modal('close');
        }, () => this.addSubmitReq = false )
      },
      onDeleteSite(){
        const site = $('form', this.$refs.editModal).find('input[name=site]').val();
        if(confirm('Confirm DELETE ' + site)){
          this.editSubmitReq = true;
          this.$root.Api.delete('sites/'+ btoa(site)).then( res => {
            this.editSubmitReq = false;
            this.updateSiteList();
            $(this.$refs.editModal).modal('close');
          }, () => this.editSubmitReq = false )
        }
      },
      updateSiteList(){
        this.loading = true;
        this.$root.Api.get('sites').then( res => {
          this.rows = res.data;
          this.loading = false;
        })
      }
    },
    data() {
      return {
        loading: true,
        editSubmitReq: false,
        addSubmitReq: false,
        customButtons:[{
          hide: false,    // Whether to hide the button
          icon: 'add', // Materialize icon
          onclick: ()=> $(this.$refs.addModal).modal('open')
         }],
        keys: ['site','name','category', 'description', 'date_launched','rank'],
        columns: [
          { label: 'Site', field: 'site', filterable: true },
          { label: 'Name', field: 'name', filterable: true },
          { label: 'Category', field: 'category', filterable: true },
          { label: 'Description', field: 'description', filterable: true },
          { label: 'Date Launched', field: 'date_launched', filterable: false },
          { label: 'Rank', field: 'rank', filterable: false },
        ],
        rows:[],
        editSite: null
      }
    },
    mounted() {
      this.updateSiteList();
      $(this.$refs.editModal).modal();
      $(this.$refs.addModal).modal();
    }
  }
</script>