import { Form, FormInstance } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { PropsWithChildren } from 'react';
import intl from 'react-intl-universal';

interface OwnProps<T> {
  form: FormInstance;
  initialValues: Store;
  hasChangedInitialValue: Record<any, boolean>;
  onHasChanged: (values: Record<any, boolean>) => void;
  onFinish: (values: T) => void;
}

const BaseForm = <T,>({
  form,
  initialValues,
  onHasChanged,
  hasChangedInitialValue,
  children,
  onFinish,
}: PropsWithChildren<OwnProps<T>>) => (
  <Form
    layout="vertical"
    form={form}
    initialValues={initialValues}
    onFieldsChange={(changedFields) => {
      if (!changedFields.length) {
        return;
      }
      const field = changedFields[0];
      onHasChanged({
        ...hasChangedInitialValue,
        [field.name as any]:
          initialValues.current &&
          JSON.stringify(initialValues.current[field.name as any]) !== JSON.stringify(field.value),
      });
    }}
    onFinish={onFinish}
    validateMessages={{
      required: intl.get('global.forms.errors.requiredField'),
      types: {
        email: intl.get('global.forms.errors.enterValidEmail'),
        url: intl.get('global.forms.errors.enterValidUrl'),
      },
    }}
  >
    {children}
  </Form>
);

export default BaseForm;
