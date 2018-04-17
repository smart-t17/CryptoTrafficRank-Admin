<template>
    <div class="panel panel-default">
        <div class="panel-heading"><i :class="'fa fa-' + fa"></i> {{ title }}</div>
        <div class="panel-body">
          <div class="row">
              <slot></slot>
          </div>
        </div>
        <div v-show="footer" class="panel-footer">
            <table>
                <tr v-for="(value, key) in footer">
                    <td>{{ key | formatName }}</td>
                    <td>{{ value | formatMoney }}$</td>
                </tr>
                <tr class="total">
                    <td>Total</td>
                    <td>{{ total | formatMoney }}$</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    export default {
        props:['title', 'fa', 'footer'],
        filters:{
            formatName: function(name){
                return name.replace(/[\s_-]+/g,' ');
            },
            formatMoney: function(n){
                n = Math.round(n*100)/100;
                let c = 2, 
                    d =  ".", 
                    t = ",", 
                    s = n < 0 ? "-" : "", 
                    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
                    j = (j = i.length) > 3 ? j % 3 : 0;
                return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
            }
        },
        computed:{
            total(){
                let total = 0;
                if(typeof this.footer == 'object'){
                    Object.keys(this.footer).forEach((key)=>{
                        total += this.footer[key];
                    })
                }
                return total;
            }
        },
        watch:{
           /* 'footer': function(){
                console.log(this.title, this.footer)
            }*/
        }
    }
</script>

<style scoped>

    
    .panel-default{
        /*box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);*/
        border:1px solid #ccc;
        border-radius: 0;
    }
    .panel-default > .panel-heading{
        font-weight: bold;
        background-color: #F8B20C;
        /*color:#fff;*/
        text-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
        border-radius: 0;
    }
    .panel-default .form-control{
        border-radius: 0;
    }

    .panel-default .panel-footer { background-color: #eee; text-align: right; overflow: auto; }
    .panel-default .panel-footer table { float: right; }
    .panel-default .panel-footer table tr td{ padding: 2px 0; font-weight: normal; }
    .panel-default .panel-footer table tr td:first-child{ font-weight: bold; }
    .panel-default .panel-footer table tr td:last-child{ padding-left: 15px; min-width: 50px; }
    .panel-default .panel-footer table tr.total td{ color: rgba(0,0,0,.3); }
</style>