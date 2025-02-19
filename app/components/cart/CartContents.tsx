import { Form, Link } from '@remix-run/react';
import { Price } from '~/components/products/Price';
import { ActiveOrderQuery, CurrencyCode, OrderLine, OrderLineCustomFields } from '~/generated/graphql';
import { useTranslation } from 'react-i18next';

export function CartContents({
  orderLines,
  currencyCode,
  editable = true,
  adjustOrderLine,
  removeItem,
}: {
  orderLines: NonNullable<ActiveOrderQuery['activeOrder']>['lines'];
  currencyCode: CurrencyCode;
  editable: boolean;
  adjustOrderLine?: (lineId: string, quantity: number) => void;
  removeItem?: (lineId: string) => void;
}) {
  return (
    <div className="flow-root">
      <ul role="list" className="-my-6 divide-y divide-gray-200">
        {(orderLines ?? []).map((line) => (
          <CartContentCards 
            line={line} 
            currencyCode={currencyCode} 
            editable={editable}
            adjustOrderLine={adjustOrderLine}
            removeItem={removeItem}
            />
        ))}
      </ul>
    </div>
  );
}

function CartContentCards({
  line, 
  currencyCode,
  editable = true,
  adjustOrderLine,
  removeItem,
}: {
  line: NonNullable<ActiveOrderQuery['activeOrder']>['lines'][0];
  currencyCode: CurrencyCode;
  editable: boolean;
  adjustOrderLine?: (lineId: string, quantity: number) => void;
  removeItem?: (lineId: string) => void;
}) {
  const { t } = useTranslation();
  const isEditable = editable !== false;
  // todo: use custom fields to generate a preview of the product.
  // const isCustomizable = Object.values(line.customFields ?? {}).some((value) => value !== '');


  return (
          <li key={line.id} className="py-6 flex">
            <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
              <img
                src={line.featuredAsset?.preview + '?preset=thumb'}
                alt={line.productVariant.name}
                className="w-full h-full object-center object-cover"
              />
            </div>

            <div className="ml-4 flex-1 flex flex-col">
              <div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <h5>
                    <Link to={`/products/${line.productVariant.product.slug}`}>
                      {line.productVariant.name}
                    </Link>
                  </h5>
                  <p className="ml-4">
                    <Price
                      priceWithTax={line.linePriceWithTax}
                      currencyCode={currencyCode}
                    ></Price>
                  </p>
                </div>
              </div>
              <div className="flex-1 flex items-center text-sm">
                {editable ? (
                  <Form>
                    <label htmlFor={`quantity-${line.id}`} className="mr-2">
                      {t('common.quantity')}
                    </label>
                    <select
                      disabled={!isEditable}
                      id={`quantity-${line.id}`}
                      name={`quantity-${line.id}`}
                      value={line.quantity}
                      onChange={(e) =>
                        adjustOrderLine &&
                        adjustOrderLine(line.id, +e.target.value)
                      }
                      className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                      <option value={7}>7</option>
                      <option value={8}>8</option>
                    </select>
                  </Form>
                ) : (
                  <div className="text-gray-800">
                    <span className="mr-1">{t('common.quantity')}</span>
                    <span className="font-medium">{line.quantity}</span>
                  </div>
                )}
                <div className="flex-1"></div>
                <div className="flex">
                  {isEditable && (
                    <button
                      type="submit"
                      name="removeItem"
                      value={line.id}
                      className="font-medium text-primary-600 hover:text-primary-500"
                      onClick={() => removeItem && removeItem(line.id)}
                    >
                      {t('common.remove')}
                    </button>
                  )}
                </div>
              </div>
                <CustomFieldsSection customFields={line.customFields ?? {}} />
            </div>
          </li>
  )
}

function CustomFieldsSection({ customFields }: { customFields: OrderLineCustomFields }) {
  return (
    <div className="flex-1 flex flex-wrap items-center text-sm">
      {Object.entries(customFields)
        .filter(([key, value]) => value !== '')
        .map(([key, value]) => (
          <div key={key}>
            <span className="font-medium">{key}</span>: {value}
          </div>
        ))}
    </div>
  );
}