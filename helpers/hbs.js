const moment = require('moment');

module.exports = {
    formatDate: function (date,format){
        //format date
        return moment(date).format(format)
    },
    truncate: function (str,len){
        //lower the memo length 
        if(str.length> len && str.length >0){
            let newStr = str+ ' '
            newStr =str.substr(0,len);
            newStr = str.substr(0,newStr.lastIndexOf(' '))
            newStr = newStr.length>0?newStr : str.substr(0,len)
            return newStr + '...'
        }
        return str
    },
    stripTags: function (input){
        //regex to strip the html tags for all lines
        return input.replace(/<(?:.|\n)*?>/gm, '')
    },
    editIcon: function(memoUser,loggedUser,memoId,floating=true){
        if(memoUser._id.toString() == loggedUser._id.toString()){
            if(floating){
                return `<a href="/memos/edit/${memoId}" class="btn-floating halfway-fab blue lighten-1 center-align"><i class="fas fa-edit fa-small"></i></a>`
            }else{
                return `<a href="/memos/edit/${memoId}" class="btn-floating half orange lighten-1 center-align"><i class="fas fa-edit fa-small"></i></a>`
            }
        }else{
            return '';
        }
    },
    select: function(selected,options){
        return options
        .fn(this)
        .replace(
            new RegExp(' value="' + selected + '"'),
            '$& selected="selected"'
        )
        .replace(
            new RegExp('>' + selected+ '</option>'),
            ' selected="selected"$&'
        )
    }
}