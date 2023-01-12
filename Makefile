importorders: 
	mongoimport  --uri "mongodb+srv://uty:user1uty@cluster0.hswbirn.mongodb.net/readers?retryWrites=true&w=majority" --collection orders  --file olist_order_items_dataset.csv --type=csv --fields="order_id","order_item_id","product_id","seller_id","shipping_limit_date","price","freight_value"

importproducts: 
	mongoimport --uri "mongodb+srv://uty:user1uty@cluster0.hswbirn.mongodb.net/readers?retryWrites=true&w=majority" --collection=products --file=olist_products_dataset.csv --type=csv --fields="product_id","product_category_name","product_name_lenght","product_description_lenght"

importsellers: 
	mongoimport --uri "mongodb+srv://uty:user1uty@cluster0.hswbirn.mongodb.net/readers?retryWrites=true&w=majority" --collection=sellers --file=olist_sellers_dataset.csv --type=csv --fields="seller_id","seller_zip_code_prefix","seller_city","seller_state"


.PHONY: 
	importorders, importproducts, importsellers