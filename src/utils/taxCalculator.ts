export const calculateTaxes = ( subtotal: number, taxRate: number = 0.15) => {
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;
    return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        taxAmount: parseFloat(taxAmount.toFixed(2)),
        total: parseFloat(total.toFixed(2))
    }
}