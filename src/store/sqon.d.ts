interface ISqon extends ISqonOperatorNode {}

interface ISqonOperatorNode {
  op: SqonGroupOperator;
  content: SqonContent[] | Number;
}

interface ISqonValueNode {
  field: String;
  value: SqonValue[];
}

type SqonValue = String | Number;
type SqonContent = ISqonOperatorNode | ISqonValueNode;
type SqonGroupOperator = 'and' | 'or';
type SqonValuesOperator = 'in';
