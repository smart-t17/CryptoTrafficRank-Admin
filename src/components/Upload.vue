<template>
  <div>
    <h5 style="margin-top:60px"><i class="fa fa-upload"></i> Upload Sites</h5>
    <span style="color:#999">Upload CSV file with values: "Site Url","Site Name","Site Category","Site Description","Site Date Launched"</span>

    <loading margin="120px auto" v-show="uploading" />

<form v-show="!uploading">
  <div class="file-field input-field">
    <div class="btn">
      <span>File</span>
      <input @change="onFileChange($event)" ref="upload_file" type="file" accept=".csv">
    </div>
    <div class="file-path-wrapper">
      <input class="file-path validate" ref="upload_file_text" placeholder="Only CSV file format" type="text">
    </div>
  </div>
</form>

<table v-show="sites.length > 0 && !uploading">
  <thead>
    <tr>
      <th>Site</th>
      <th>Name</th>
      <th>Category</th>
      <th>Description</th>
      <th>Date Launched</th>  
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in sites" :class="{invalid:item.invalid}" :title="item.invalid">
      <td>{{item.site}}</td>
      <td>{{item.name}}</td>
      <td>{{item.category}}</td>
      <td>{{item.description}}</td>
      <td>{{item.date_launched}}</td>  
    </tr>
  </tbody>
</table>

<button v-show="sites.length && !uploading" type="button" @click.prevent="onFileUpload" class="waves-effect waves-light btn">Upload</button>


</div>
</template>

<style scoped>
 tr.invalid {
   background: #EE6E73;
   color:rgba(255,255,255,.5);
 }
</style>

<script>
  import Papa from 'papaparse'
  import Loading from './shared/Loading'
  export default {
    components: { Loading },
    data() {
      return {
        uploading:false,
        sites: []
      }
    },
    methods: {
      onFileChange(event) {
        Papa.parse(event.target.files[0], {
          complete: (res) => {
            this.sites = [];
            res.data.forEach(el => {
              el.map( str => { return typeof str == 'string' ? str.trim() : null } )
              let site = el[0] || '';
              let name = el[1] || '';
              let category = el[2] || '';
              let description = el[3] || '';
              let date_launched = el[4] || '';
              
              let invalid = '';

              if(!/^http(s?)\:\/\//i.test(site)){
                site = 'http://' + site;
              }
              
              if(!this.$root.Helper.validUrl(site) || !/[\.]+/g.test(site)){
                invalid = 'Invalid Site Url';
              }
              else{
                site = site.replace(/\/$/,'');
              }

              this.sites.push({
                site, name, category, description, date_launched, invalid
              })
            })
          }
        });

      },
      onFileUpload() {
        this.uploading = true;
        this.$root.Api.post('sites', this.sites.filter(obj => {
          return !obj.invalid
        })).then( res => {
          this.uploading = false;
          this.$refs.upload_file.value = '';
          this.$refs.upload_file_text.value = '';
          this.sites = [];
          this.$router.push('/sites');
        }, () => this.uploading = false )
      },
    }
  }
</script>