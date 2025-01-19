# kanshin-archive
Convert scraped contents of 関心空間 (closed in 2016) in DynamoDB to sqlite format for easy handling.

## Preparation

```
pnpm install
```

## Exporting json from DynamoDB

The result of original scraping was stored in DynamoDB in `us-west-2`. The following is the command to export the contents to json. Table names are separated by original table names:

- KanshinCom-user
- KanshinCom-keyword
- KanshinCom-diary
- KanshinCom-connection

Exporting the contents of those table to json can be done by the following `aws` clie command:
```
aws dynamodb scan --table-name <table_name> --output json > data/<table_name>.dump.json
```

## Simplifying the json

Because the json exported from DynamoDB is too huge to be handled in JavaScript, we need to reduce the size of json file by simplifying the content. The following is the command to simplify the json:

```
python3 tools/simplify-json.py data/<table_name>-dump.json > data/<table_name>.json
```

At this point, simplified json files are ready to be imported to sqlite at data directory.

- data/users.json
- data/keywords.json
- data/diaries.json
- data/connections.json

These json file names are hard-coded in the following scripts so they must be named as above.

## Creating sqlite database

To create sqlite database, run the following command:

```
pnpm db:create
```

This command will create `kanshin.db` in the root directory.

## Importing json to sqlite

Run the following command to create sqlite database and import the json files to the database:

```
pnpm db:import
```
