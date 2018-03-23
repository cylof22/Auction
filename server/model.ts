export class Product {
  constructor(
    public id: number,
    public title: string,
    public owner: string,
    public creator: string,
    public price: number,
    public rating: number,
    public description: string,
    public url: string,
    public styleImgUrl: string,
    public categories: string[]) {}
}

export class Review {
  constructor(
    public id: number,
    public productId: number,
    public timestamp: string,
    public user: string,
    public rating: number,
    public comment: string) {}
}

export function getProducts(params = <any>{}): Product[] {
  let result = products;

  if (params.title) {
    result = result.filter(
      p => p.title.toLowerCase().indexOf(params.title.toLowerCase()) !== -1);
  }
  if (parseInt(params.price) && result.length > 0) {
    result = result.filter(
      p => p.price <= parseInt(params.price));
  }
  if (params.category && result.length > 0) {
    result = result.filter(
      p => p.categories.indexOf(params.category.toLowerCase()) !== -1);
  }

  return result;
}

export function getProductById(productId: number): Product {
  return products.find(p => p.id === productId);
}

export function getReviewsByProductId(productId: number): Review[] {
  return reviews.filter(r => r.productId === productId);
}

var products = [
  new Product(0, 'First Product', '张三', '李四', 24.99, 4.3, 'This is a short description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', "http://localhost:8000/outputs/16-output.jpg", "http://localhost:8000/styles/6-style.jpg", ['electronics', 'hardware']),
  {
    "id": 1,
    "title": "Second Product",
    "owner": "李四",
    "creator": "王五",
    "price": 64.99,
    "rating": 3.5,
    "description": "This is a short description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "url":"http://localhost:8000/outputs/11-output.jpg",
    "styleImgUrl":"http://localhost:8000/styles/1-style.jpg",
    "categories": ["books"]
  },
  {
    "id": 2,
    "title": "Third Product",
    "owner": "张胜",
    "creator": "王五",
    "price": 74.99,
    "rating": 4.2,
    "description": "This is a short description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "url":"http://localhost:8000/outputs/34-output.jpg",
    "styleImgUrl":"http://localhost:8000/styles/2-style.jpg",
    "categories": ["electronics"]
  },
  {
    "id": 3,
    "title": "Fourth Product",
    "owner": "李非",
    "creator": "王天",
    "price": 84.99,
    "rating": 3.9,
    "description": "This is a short description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "url":"http://localhost:8000/outputs/21-output.jpg",
    "styleImgUrl":"http://localhost:8000/styles/3-style.jpg",
    "categories": ["hardware"]
  },
  {
    "id": 4,
    "title": "Fifth Product",
    "owner": "谭龙",
    "creator": "王非",
    "price": 94.99,
    "rating": 5,
    "description": "This is a short description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "url":"http://localhost:8000/outputs/44-output.jpg",
    "styleImgUrl":"http://localhost:8000/styles/4-style.jpg",
    "categories": ["electronics", "hardware"]
  },
  {
    "id": 5,
    "title": "Sixth Product",
    "owner": "谢龙",
    "creator": "王五",
    "price": 54.99,
    "rating": 4.6,
    "description": "This is a short description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "url":"http://localhost:8000/outputs/52-output.jpg",
    "styleImgUrl":"http://localhost:8000/styles/5-style.jpg",
    "categories": ["books"]
  }
];

var reviews = [
  {
    "id": 0,
    "productId": 0,
    "timestamp": "2014-05-20T02:17:00+00:00",
    "user": "User 1",
    "rating": 5,
    "comment": "Aenean vestibulum velit id placerat posuere. Praesent placerat mi ut massa tempor, sed rutrum metus rutrum. Fusce lacinia blandit ligula eu cursus. Proin in lobortis mi. Praesent pellentesque auctor dictum. Nunc volutpat id nibh quis malesuada. Curabitur tincidunt luctus leo, quis condimentum mi aliquet eu. Vivamus eros metus, convallis eget rutrum nec, ultrices quis mauris. Praesent non lectus nec dui venenatis pretium."
  },
  {
    "id": 1,
    "productId": 0,
    "timestamp": "2014-05-20T02:53:00+00:00",
    "user": "User 2",
    "rating": 3,
    "comment": "Aenean vestibulum velit id placerat posuere. Praesent placerat mi ut massa tempor, sed rutrum metus rutrum. Fusce lacinia blandit ligula eu cursus. Proin in lobortis mi. Praesent pellentesque auctor dictum. Nunc volutpat id nibh quis malesuada. Curabitur tincidunt luctus leo, quis condimentum mi aliquet eu. Vivamus eros metus, convallis eget rutrum nec, ultrices quis mauris. Praesent non lectus nec dui venenatis pretium."
  },
  {
    "id": 2,
    "productId": 0,
    "timestamp": "2014-05-20T05:26:00+00:00",
    "user": "User 3",
    "rating": 4,
    "comment": "Aenean vestibulum velit id placerat posuere. Praesent placerat mi ut massa tempor, sed rutrum metus rutrum. Fusce lacinia blandit ligula eu cursus. Proin in lobortis mi. Praesent pellentesque auctor dictum. Nunc volutpat id nibh quis malesuada. Curabitur tincidunt luctus leo, quis condimentum mi aliquet eu. Vivamus eros metus, convallis eget rutrum nec, ultrices quis mauris. Praesent non lectus nec dui venenatis pretium."
  },
  {
    "id": 3,
    "productId": 0,
    "timestamp": "2014-05-20T07:20:00+00:00",
    "user": "User 4",
    "rating": 4,
    "comment": "Aenean vestibulum velit id placerat posuere. Praesent placerat mi ut massa tempor, sed rutrum metus rutrum. Fusce lacinia blandit ligula eu cursus. Proin in lobortis mi. Praesent pellentesque auctor dictum. Nunc volutpat id nibh quis malesuada. Curabitur tincidunt luctus leo, quis condimentum mi aliquet eu. Vivamus eros metus, convallis eget rutrum nec, ultrices quis mauris. Praesent non lectus nec dui venenatis pretium."
  },
  {
    "id": 4,
    "productId": 0,
    "timestamp": "2014-05-20T11:35:00+00:00",
    "user": "User 5",
    "rating": 5,
    "comment": "Aenean vestibulum velit id placerat posuere. Praesent placerat mi ut massa tempor, sed rutrum metus rutrum. Fusce lacinia blandit ligula eu cursus. Proin in lobortis mi. Praesent pellentesque auctor dictum. Nunc volutpat id nibh quis malesuada. Curabitur tincidunt luctus leo, quis condimentum mi aliquet eu. Vivamus eros metus, convallis eget rutrum nec, ultrices quis mauris. Praesent non lectus nec dui venenatis pretium."
  },
  {
    "id": 5,
    "productId": 0,
    "timestamp": "2014-05-20T11:42:00+00:00",
    "user": "User 6",
    "rating": 5,
    "comment": "Aenean vestibulum velit id placerat posuere. Praesent placerat mi ut massa tempor, sed rutrum metus rutrum. Fusce lacinia blandit ligula eu cursus. Proin in lobortis mi. Praesent pellentesque auctor dictum. Nunc volutpat id nibh quis malesuada. Curabitur tincidunt luctus leo, quis condimentum mi aliquet eu. Vivamus eros metus, convallis eget rutrum nec, ultrices quis mauris. Praesent non lectus nec dui venenatis pretium."
  }
];
