import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import cdk = require("@aws-cdk/core");
import * as lambda from "@aws-cdk/aws-lambda";
import { HitCounter } from "../lib/hitcounter";

test("DynamoDB Table Created With Encryption", () => {
  const stack = new cdk.Stack();
  // WHEN
  new HitCounter(stack, "MyTestConstruct", {
    downstream: new lambda.Function(stack, "TestFunction", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "hello.handler",
      code: lambda.Code.fromAsset("lambda"),
    }),
  });
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::DynamoDB::Table", {
      SSESpecification: {
        SSEEnabled: true,
      },
    })
  );
});

test("Lambda Has Environment Variables", () => {
  const stack = new cdk.Stack();
  // WHEN
  new HitCounter(stack, "MyTestConstruct", {
    downstream: new lambda.Function(stack, "TestFunction", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "hello.handler",
      code: lambda.Code.fromAsset("lambda"),
    }),
  });
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::Lambda::Function", {
      Environment: {
        Variables: {
          DOWNSTREAM_FUNCTION_NAME: { Ref: [1] },
          HITS_TABLE_NAME: { Ref: [1] },
        },
      },
    })
  );
});
