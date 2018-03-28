export class Product {
  constructor(
    public id: string,
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
    public productId: string,
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

export function getProductById(productId: string): Product {
  return products.find(p => p.id === productId);
}

export function getReviewsByProductId(productId: string): Review[] {
  return reviews.filter(r => r.productId === productId);
}

function generateUUID(): string {
  let d = new Date().getTime();
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
};

function createImageFile(imageData: string, imageName: string): string {
  let imageUrl: string = "";
  let pos = imageData.indexOf(",");
  let base64d = imageData.substring(pos+1);
  let path = "build/data/styles/" + imageName + ".png";
  let fs = require('fs');
  fs.writeFile(path, base64d, 'base64', function(err)  {
      if(err) {
        console.log(err);
        return imageUrl;
      }
    });

  console.log("The image file is saved!");
  imageUrl = "http://127.0.0.1:8000/styles/" + imageName + ".png";

  return imageUrl;
}

var products = readProducts();

export function addProduct(productData = <any>{}): Product {
  // create an unique id
  let imageId = generateUUID();

  // save image
  let newImageUrl: string = "";
  if ("undefined" != typeof productData.url
       && productData.url != "") {
    console.log("has image data");
    newImageUrl = createImageFile(productData.url, imageId);
    } else {
    console.log("no image data");
  }

  // save new image data
  let newProduct = new Product("", "", "", "", 0, 0, "", "", "", []);
  newProduct.id = imageId;
  newProduct.owner = productData.owner;
  newProduct.creator = productData.creator;
  newProduct.title = productData.title;
  newProduct.description = productData.description;
  newProduct.price = productData.price;
  newProduct.categories = productData.categories;
  newProduct.url = newImageUrl;

  products.splice(0, 0, newProduct);

  // update data file
  updateProducts();

  return newProduct;
}

function readProducts() : any {
  let fs = require('fs');
  let file = "build/data/info/images.json";
  return JSON.parse(fs.readFileSync( file)); 
}

function updateProducts(): void {
  let fs = require('fs');
  let path = "build/data/info/images.json";
  let newData = JSON.stringify(products);
  console.log(newData);
  fs.writeFile(path, newData, function(err)  {
    if(err) {
      console.log(err);
    }

    console.log("Products are updated!");
  });
}

var reviews = [
  {
    "id": 0,
    "productId": "0",
    "timestamp": "2014-05-20T02:17:00+00:00",
    "user": "User 1",
    "rating": 5,
    "comment": "Aenean vestibulum velit id placerat posuere. Praesent placerat mi ut massa tempor, sed rutrum metus rutrum. Fusce lacinia blandit ligula eu cursus. Proin in lobortis mi. Praesent pellentesque auctor dictum. Nunc volutpat id nibh quis malesuada. Curabitur tincidunt luctus leo, quis condimentum mi aliquet eu. Vivamus eros metus, convallis eget rutrum nec, ultrices quis mauris. Praesent non lectus nec dui venenatis pretium."
  },
  {
    "id": 1,
    "productId": "0",
    "timestamp": "2014-05-20T02:53:00+00:00",
    "user": "User 2",
    "rating": 3,
    "comment": "Aenean vestibulum velit id placerat posuere. Praesent placerat mi ut massa tempor, sed rutrum metus rutrum. Fusce lacinia blandit ligula eu cursus. Proin in lobortis mi. Praesent pellentesque auctor dictum. Nunc volutpat id nibh quis malesuada. Curabitur tincidunt luctus leo, quis condimentum mi aliquet eu. Vivamus eros metus, convallis eget rutrum nec, ultrices quis mauris. Praesent non lectus nec dui venenatis pretium."
  },
  {
    "id": 2,
    "productId": "0",
    "timestamp": "2014-05-20T05:26:00+00:00",
    "user": "User 3",
    "rating": 4,
    "comment": "Aenean vestibulum velit id placerat posuere. Praesent placerat mi ut massa tempor, sed rutrum metus rutrum. Fusce lacinia blandit ligula eu cursus. Proin in lobortis mi. Praesent pellentesque auctor dictum. Nunc volutpat id nibh quis malesuada. Curabitur tincidunt luctus leo, quis condimentum mi aliquet eu. Vivamus eros metus, convallis eget rutrum nec, ultrices quis mauris. Praesent non lectus nec dui venenatis pretium."
  },
  {
    "id": 3,
    "productId": "0",
    "timestamp": "2014-05-20T07:20:00+00:00",
    "user": "User 4",
    "rating": 4,
    "comment": "Aenean vestibulum velit id placerat posuere. Praesent placerat mi ut massa tempor, sed rutrum metus rutrum. Fusce lacinia blandit ligula eu cursus. Proin in lobortis mi. Praesent pellentesque auctor dictum. Nunc volutpat id nibh quis malesuada. Curabitur tincidunt luctus leo, quis condimentum mi aliquet eu. Vivamus eros metus, convallis eget rutrum nec, ultrices quis mauris. Praesent non lectus nec dui venenatis pretium."
  },
  {
    "id": 4,
    "productId": "0",
    "timestamp": "2014-05-20T11:35:00+00:00",
    "user": "User 5",
    "rating": 5,
    "comment": "Aenean vestibulum velit id placerat posuere. Praesent placerat mi ut massa tempor, sed rutrum metus rutrum. Fusce lacinia blandit ligula eu cursus. Proin in lobortis mi. Praesent pellentesque auctor dictum. Nunc volutpat id nibh quis malesuada. Curabitur tincidunt luctus leo, quis condimentum mi aliquet eu. Vivamus eros metus, convallis eget rutrum nec, ultrices quis mauris. Praesent non lectus nec dui venenatis pretium."
  },
  {
    "id": 5,
    "productId": "0",
    "timestamp": "2014-05-20T11:42:00+00:00",
    "user": "User 6",
    "rating": 5,
    "comment": "Aenean vestibulum velit id placerat posuere. Praesent placerat mi ut massa tempor, sed rutrum metus rutrum. Fusce lacinia blandit ligula eu cursus. Proin in lobortis mi. Praesent pellentesque auctor dictum. Nunc volutpat id nibh quis malesuada. Curabitur tincidunt luctus leo, quis condimentum mi aliquet eu. Vivamus eros metus, convallis eget rutrum nec, ultrices quis mauris. Praesent non lectus nec dui venenatis pretium."
  }
];
