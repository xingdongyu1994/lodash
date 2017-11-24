var Ctor = function() {}
//keys
function xdy_keys(obj) {
    var  arrkey = []
    for(var key in obj) {
       if(xdy_has(obj,key)) {
          arrkey.push(key)
       }
    }
    return arrkey
 }
 //allkeys  对象所有包括继承属性名称 标签对象
 function xdy_allkeys(obj) {
   var keys= []
   if(!xdy_object(obj)){
     return []
   } else {
     for(var key in obj) {
       keys.push(key)
     }
   }
   return keys
 }
 function xdy_getlength (obj) {
   return obj == null ? void 0 : obj['length']
 }
 //判断是否为类数组
 function isarrarlike(obj) {
   let length = xdy_getlength(obj)
   return typeof length =='number'&& length >= 0 
 }
 //now 时间
 function xdy_now(){
   return new Date().getTime()
 }
 //baseCreate  对象创建的处理
 function xdy_basecreate(prototype) {
   if(!xdy_object(prototype)){
     return {}
   }
   //赋值给ctor原型
   Ctor.prototype = prototype
   //创建实例
   var result = new Ctor
   Ctor.prototype = null
   return result
 } 

 //判断 是否有键值
 function xdy_has(obj, key) {
     return obj!=null && hasOwnProperty.call(obj,key)
 }
 //判断 是否是函数
 function xdy_function(value) {
    return typeof value =='function' || false
 }
 //判断 是否是对象
 function xdy_object(obj) {
    var  type = typeof obj
    return type === 'function' || type === 'object' && !!obj
 }
 //判断 是否是数组
 function xdy_array(obj) {
    return Object.prototype.toString.call(obj) == '[object Array]'
 }
 //判断是否有arguments
 function xdy_arguments(obj) {
    return Object.prototype.toString.call(obj) == '[object Arguments]'
 }
 //判断是为isboolean
 function xdy_isboolean(obj) {
    return obj ===true || obj === false || Object.prototype.toString.call(obj) == '[object Boolean]'
 }
 //判断是否为NaN
 function xdy_isnan(obj) {
   return obj !==obj
 }
 //判断是否为undefined
 function xdy_undefined(obj) {
   return obj === void 0
 }
 //isstring 是否为字符串  标签对象
 function xdy_isstring(obj) {
    return Object.prototype.toString.call(obj) == '[object String]'
 }
 //返回 本身
 function xdy_identity(value) {
     return value
 }
 //优化下回调函数
 function xdy_optimizecallback(fun,context,argConut) {
    if(context === void 0) {
      return fun
    }
    switch(argConut == null ?3:argConut) {
        case 1: return function(value) {
          return fun.call(context,value)
        }
        case 3: return function(value, index, collection) {
          return fun.call(context,value,index,collection)
        }
    }
    return function() {
        return fun.apply(context,arguments)
    }
 }
 //判断 是否是key-value
 function xdy_ismatch(object, attrs) {
   var keys = xdy_keys(attrs)
   var length = keys.length
   var obj = Object(object)
   for(var i=0; i<length; i++) {
     var key = keys[i]
     if(attrs[key] !== obj[key] || !(key in obj)) {
       return false
     }
   }
   return true
 }
//判断是对象来匹配
 function xdy_matches(attrs) {
   return function (obj) {
       return xdy_ismatch(obj,attrs)
   }
 }
 //
 function xdy_property(key) {
   return function(obj) {
     return obj == null? void 0:obj[key]
   }
 }
 //回调函数
 function xdy_callback(fun,context,argConut) {
    if(fun == null) {
       xdy_identity(fun)
    }
    if(xdy_function(fun)) {
       return xdy_optimizecallback(fun,context,argConut)
    }
    if(xdy_object(fun)) {
       return xdy_matches(fun)
    }
    return xdy_property(fun)
 }
 //排序 数组 二分查找
 function xdy_sortedIndex(arr, obj,fun,context) {
    fun = xdy_callback(fun, context) 
    var low =0;
     var high = arr.length
     while(low<high) {
      var mid = Math.floor((low+high)/2)
      if(fun(arr[mid])<fun(obj)) {
        low = mid+1
      } else {
        high = mid
      }
     }
     return high
 }
 //查找 索引值
 function cretecallbackfindindex(dir) {
    return function(arr,fun,context) {
      fun = xdy_callback(fun,context)
      var length = arr.length
      var index = dir >0 ?0: length-1
      for(; index>=0 && index<length; index+=dir) {
       if(fun(arr[index], index, arr)) {
        return index
       }
      }
      return -1
    }
  }
 var xdy_findindex=cretecallbackfindindex(1)

 //查找索引值  indexof
 function creteindexoffinder(dir){
   return function(arr,item,idx) {
     var length = arr.length
     var index=0
     if(typeof idx == 'number') {
       if(dir>0) {
           index =idx>=0?idx:Math.max(length+idx,0)
       } else {
           length = idx>=0?Math.min(idx+1,length):idx+length+1
       }
     }
     for(idx=dir>0?index:length-1; idx>=0 && idx<length; idx+=dir) {
       if(arr[idx] === item) {
         return idx
       }
     }
     return -1
   }
 }
 var xdy_indexof = creteindexoffinder(1)

//values  标签对象
function xdy_values(obj) {
    var keys = xdy_keys(obj)
    console.log("BB",keys)
    var length = keys.length
    var newarr = Array(length)
    for(var i=0;i<length; i++) {
      newarr[i] = obj[keys[i]]
    }
    return newarr
}
//findkey  标签对象
function xdy_findkey(obj,fun,context) {
   var keys = xdy_keys(obj)
   fun = xdy_callback(fun,context)
   var length = keys.length
   var key
   for(var i=0; i<length; i++) {
     key = keys[i]
     if(fun(obj[key],key,obj)) {
       return key
     }
   }
}
//invert  标签对象
function xdy_invert(obj) {
  var result = {}
  var keys = xdy_keys(obj)
  var length = keys.length
  for(var i=0; i<length; i++) {
    result[obj[keys[i]]] = keys[i]
  }
  return result
}
//contains 标签集合
function xdy_contains(obj, item, fromindex) {
  if(!xdy_array(obj)) {
     obj = xdy_values(obj)
  }
  if(typeof fromindex != 'number') {
    fromindex =0
  }
  return xdy_indexof(obj, item,fromindex) >=0
}
//foreach each 标签集合
function xdy_each(obj,fun,context) {
    fun = xdy_callback(fun)
    var i;
    var length = obj.length;
    if(xdy_array(obj)) {
      for(i=0; i<length; i++) {
        fun(obj[i], i, obj)
      }
    } else {
        var keys = xdy_keys(obj)
        var length = keys.length
        for(i=0; i<length; i++) {
          fun(obj[keys[i]], keys[i], obj)
        }
    }
    return obj
}
//filter   标签集合
function xdy_filter(obj,fun,context) {
  var result = []
  fun = xdy_callback(fun,context)
  xdy_each(obj,function(item, index, list){
    if(fun(item,index,list)) {
       result.push(item)
    }
  })
  return result
}
//find  标签集合  查找元素S
function xdy_find(obj, fun, context) {
  var key 
  if(xdy_array(obj)) {
    key = xdy_findindex(obj,fun,context)
  } else {
    key = xdy_findkey(obj,fun,context)
  }
  console.log("key是",key)
  if(key!==-1) {
      return obj[key]
  }
}
//size  标签集合 集合长度
function xdy_size(obj) {
   if(obj == null) {
     return 0
   }
   return xdy_array(obj)?obj.length: xdy_keys(obj).length
}

//drop  返回前面元素以外的其他元素   标签数组
function xdy_drop(obj,n) {
  return Array.prototype.slice.call(obj,n==null?1: n)
}

//initial  返回除了最后的元素以外的其他元素  标签数组
function xdy_initial(obj,n) {
  return Array.prototype.slice.call(obj, 0, Math.max(0, obj.length - (n == null ? 1 : n)))
}
//last   放回最后一个元素  标签数组
function xdy_last(obj,n) {
  if(obj == null) {
    return  void 0
  }
  if(n == null) {
    return obj[obj.length-1]
  }
  return xdy_drop(obj,Math.max(0,obj.length-n))
}
//flatten  来改变数组嵌套  改变维数  标签数组
function flatten(arr,shallow,output) {
    output = output || []
    var idx = output.length
    for(var i=0; i<arr.length; i++) {
      var value = arr[i]
      if(xdy_array(value)) {
        if(!shallow) {
            var j=0;
            var len = value.length
            while(j<len){
              output[idx++] = value[j++]
            }
        } else {
            flatten(value, shallow, output);
            idx = output.length;
        }
      } else {
          output[idx++] = value
      }
    }
    return output
}
function xdy_flatten(arr, shallow) {
    return flatten(arr,shallow)
}
//difference  过滤掉元素   标签数组
function xdy_difference(obj,parm){
  var rest = xdy_flatten(parm,true)
   return xdy_filter(obj,function(value) {
      return !xdy_contains(rest,value)
   })
}
//without  标签数组 过滤数组  跟difference不同之处不改变原数组
function xdy_whithout() {

}


// bind   标签函数
function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
  if(!(callingContext instanceof boundFunc)) {
    return sourceFunc.apply(context,args)
  }
  //处理new 调用形式
  var self = xdy_basecreate(sourceFunc.prototype)
  var result = sourceFunc.apply(self,args) 
  if(xdy_object(result)) {
    return result
  }
  return self
}
function xdy_bind(func,context) {
  if(!xdy_function(func)) {
    throw new TypeError('Bind must be called on a function');
  } 
  var args = Array.prototype.slice.call(arguments,2)
  var bound = function() {
    return  executeBound(func,bound,context,this,args.concat(Array.prototype.slice.call(arguments)))
  }
  return bound
}
//delay 延迟函数  标签函数
function xdy_delay(func, wait) {
  var args = Array.prototype.slice.call(arguments,2)
  return setTimeout(function(){
    return func.apply(null,args)
  },wait)
}
//debounce   标签函数
function xdy_debounce (func,delay) {
  //维护一个timer
  //这里出现一个问题 就是高频发时候 要取消掉前一次超时调用 导致不能处理程序不能触发
  var  timer=null
  return function() {
    var context = this
    var args = arguments
    clearTimeout(timer)
    timer = xdy_delay(function(){
      func.apply(context,args)
    },delay)
  }
}
function xdy_debounce2 (func,delay,immediate) {
  //维护一个timer
  //这里出现一个问题 就是高频发时候 要取消掉前一次超时调用 导致不能处理程序不能触发
  var  timer=null
  return function() {
    var context = this
    var args = arguments
    if(timer) {
     clearTimeout(timer)
    }
    if(immediate) {
      var dotime = !timer
      timer = setTimeout(function(){
         timer = null
      },delay)
      if(dotime) {
        func.apply(context,args)
      }
    } else {
      timer = xdy_delay(function(){
        func.apply(context,args)
      },delay)
    }
  }
}

//节流throttle  标签函数
function xdy_throttle (func,delay) {
  var per = xdy_now()
  return function()  {
    var context = this
    var args = arguments
    var now = xdy_now()
    if(now-per >= delay) {
      func.apply(context,args)
      per = xdy_now()
    }
  }
}
function xdy_throttle2(func,delay) {
  var timer = null
  return function() {
    var context = this
    var args = arguments
    if(!timer) {
      timer = setTimeout(function(){
        func.apply(context,args)
         timer =null
       },delay)
    }
  }
}



//extend 拷贝   标签对象
function createassign(keysfunc,undefinedOnly) {
   return function(obj){
     var length = arguments.length
     if(length<2|| obj== null) {
        return obj
     }
     for(var index =1; index<length; index++) {
        var source = arguments[index]
        var keys = keysfunc(source)
        var l = keys.length
        for(var i=0; i<l; i++) {
          var key = keys[i]
          if(!undefinedOnly || obj[key] === void 0) {
            obj[key] = source[key] 
          }
          
        }
     }
     return obj
   }
}
var xdy_assign = createassign(xdy_keys,true)

//clone  
function xdy_clone (obj) {
  if(!xdy_object(obj)) {
    return obj
  }
  return xdy_array(obj)?obj.slice(): xdy_assign({},obj)
}



//isempty  检查是否为空  标签对象
function xdy_isempty(obj) {
  if(!xdy_object(obj)) {
    return obj
  }
  //如果是字符串检查是否为0
  if(xdy_array(obj) || xdy_isstring(obj)) {
    return obj.length ===0
  }
  //检查对象
  for(var key in obj) {
    if(xdy_has(obj, key)) {
      return false
    }
  }
  return true
}

var obj = {"name":undefined,"age":[1,2,3]}
var obj2 = {"addres":"handan","name":"xiaobai"}
var arr = [1,2,3,3,3,4,5]
function resizethrottleHandler() {
  console.log("改变")
}
// var objs = {'name':'xingdongyu'}
// var aaa = xdy_bind(xdy,objs)
// window.onresize = xdy_throttle2(resizethrottleHandler,2000,true)
// var aa = xdy_clone(obj)
console.log("结果",xdy_isempty([1]))
// obj['age']=122
// console.log("发大水",obj)
