function Post(args){
    this.title = args.title;
    this.postedOn = args.postedOn;
    this.content = args.content;

    this.shortTitle = (args.title || "")
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[- ]+-[- ]+/g, "-")
        .trim();

    this.coordinates = [this.location(), 0];
}

Post.prototype.location = function(){
    return parseFloat("0." + this.postedOn.getTime());
}

module.exports = Post;