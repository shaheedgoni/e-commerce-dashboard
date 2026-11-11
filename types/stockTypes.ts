export type stockResponseProps = {
  data: stockProps[];
  meta: { total: number };
};

export type stockProps = {
  variantId: string;
  sku: string;
  productId: string;
  productName: string;
  variantName: string;
  status: string;
  stockQuantity: number;
  lowStock: boolean;
};
