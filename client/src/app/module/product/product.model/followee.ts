export class Followee {
    constructor(
        public productid: string,
	    public user: string,
        public timestamp: Date,
    ) {
    }
}

export class FolloweeProduct {
    constructor(
        public id : string,
        public url : string
    ){
    }
}