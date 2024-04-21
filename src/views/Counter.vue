<template>
 <!-- component -->
 
<div class="min-w-screen min-h-screen bg-gray-500 flex items-center justify-center px-5 py-5" x-data="beer()" x-init="start()">
    <div class="text-yellow-100">
         <div class="text-6xl text-center flex w-full items-center justify-center ">
             <div class="w-24 mx-6 p-6 bg-gray-800 text-white rounded-lg  ">
                <div class="font-mono leading-none" x-text="days">{{dispalayDays}}</div>
                <div class="font-mono uppercase text-sm leading-none">Days</div>
            </div>
            <div class="w-24 mx-6 p-6 bg-gray-800 text-white rounded-lg">
                <div class="font-mono leading-none" x-text="hours">{{dispalayHours}}</div>
                <div class="font-mono uppercase text-sm leading-none">Hours</div>
            </div>
            <div class="w-24 mx-6 p-6 bg-gray-800 text-white rounded-lg">
                <div class="font-mono leading-none" x-text="minutes">{{dispalayMinutes}}</div>
                <div class="font-mono uppercase text-sm leading-none">Minutes</div>
            </div>
             <div class="w-24 mx-6 p-6 bg-gray-800 text-white rounded-lg">
                <div class="font-mono leading-none" x-text="seconds">{{dispalaySeconds}}</div>
                <div class="font-mono uppercase text-sm leading-none">Seconds</div>
            </div>
        </div>
     </div>
</div>
 
 
</template>

<script>
 
  

export default {

    props: ['year','month','date','hour','second'],
data:()=>({
   dispalayDays: 0, 
   dispalayHours: 0,
   dispalayMinutes: 0,
   dispalaySeconds: 0
}),
computed: {
    _seconds:()=>1000,
    _minutes(){
        return this._seconds * 60;
    },
    _hours(){
        return this._minutes * 60;
    },
    _days(){
        return this._hours * 24;
    },
    end(){
        return new Date(
            this.year,
            this.month,
            this.hour,
            this.minute,
            this.second,
        );
    }
},
mounted(){
this.showRemaining();
},
methods:{
   formatNum: num => (num < 10 ? "0" + num : num),
    showRemaining(){
        const timer = setInterval(()=>{
            const now = new Date();
           // const end = new Date(2022, 12, 30, 10, 10, 10, 10);

            const distance = this.end.getTime() - now.getTime();

            if(distance < 0){
                clearInterval(timer);
                return;
            }
 
            
  const days = Math.floor(distance / this._days);
  const hours = Math.floor((distance % this._days) / this._hours);
  const minutes = Math.floor((distance % this._hours) / this._minutes);
  const seconds = Math.floor((distance % this._minutes) / this._seconds);
  this.dispalayMinutes = this.formatNum(minutes);
  this.dispalaySeconds = this.formatNum(seconds);
  this.dispalayHours = this.formatNum(hours);
  this.dispalayDays = this.formatNum(days);
        }, 1000);
    }
}


};
</script>

<style>

</style>