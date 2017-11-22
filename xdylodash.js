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
var obj = {
    'barney':  { 'age': 36, 'active': true },
    'fred':    { 'age': 40, 'active': false },
    'pebbles': { 'age': 1,  'active': true }
  };
var arr = [1,2,3,3,3,4,5]
console.log("原始",arr)

console.log("结果",xdy_difference(arr,[2,3]))
