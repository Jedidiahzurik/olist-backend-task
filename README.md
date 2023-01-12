### APPLICATION

After installing dependencies, follow these steps:

- visit [https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce/code] to download the following csv files then add them to the root folder:
  -- olist_order_items_dataset.csv
  -- olist_products_dataset.csv
  -- olist_sellers_dataset.csv

- run

```bash
  make importorders
```

and

```bash
make importproducts
```

and

```bash
make importsellers
```

to migrate the csv file
Note: if you want to change the atlas database then add a [MONGODB_URI] to your .env
Also add [JWT_SECRET] to your .env
Make sure to pass the [x-auth-token] as a header (not bearer) on each request. This token can be gotten as a response after logging in.

run

```bash
yarn dev
```

or

```bash
npm run dev
```

or

```bash
pnpm dev
```

to start in development mode

### AVailable API Endpoints

- /login -this endpoint is to login the user, taking fields username for the sellers_id and password for seller_zip_code_prefix.
- /account -this is takes a patch request with body fields state and city to update user's current state or city.
- /order_items -this endpoint takes a get request with query params of limit and offset to perform pagination. It returns orderd items by current logged in user.
- /order_items/:id -this is takes a delete request, client should pass the order item's id to delete from the database.
