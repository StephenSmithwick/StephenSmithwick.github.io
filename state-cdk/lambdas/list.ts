import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';

const TABLE_NAME = process.env.TABLE_NAME || '';

const db = DynamoDBDocument.from(new DynamoDB());

export const handler = async (event: any = {}): Promise<any> => {
  if (!event.body) {
    return { statusCode: 400, body: 'invalid request, you are missing the parameter body' };
  }
  const item = typeof event.body == 'object' ? event.body : JSON.parse(event.body);

  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "page = :page",
    ExpressionAttributeValues: {
      ":page": { S: item["page"] },
    },
  };

  try {
    const response = await db.scan(params);
    return { statusCode: 200, body: JSON.stringify(response.Items) };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};
