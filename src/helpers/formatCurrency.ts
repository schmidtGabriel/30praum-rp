const formatCurrency = (value: number, type: 'Real' | 'Dolar' = 'Real') => {
  if (type === 'Real') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }
};

export default formatCurrency;
