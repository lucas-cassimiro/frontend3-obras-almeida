export async function getMacroservices() {
  const response = await fetch("http://localhost:3333/macroservices/");
  return await response.json();
}

export async function getSubservices(id: number) {
  const response = await fetch(`http://localhost:3333/subservices/${id}`);
  return await response.json();
}

export async function getContracts() {
  const response = await fetch("http://localhost:3333/contracts");
  return await response.json();
}

export async function getPayments() {
  const response = await fetch("http://localhost:3333/payments");
  return await response.json();
}

export async function getPositions() {
  const response = await fetch("http://localhost:3333/positions");
  return await response.json();
}

export async function getWorksAddress() {
  const response = await fetch("http://localhost:3333/worksAddress");
  return await response.json();
}

export async function getEmployee() {
  const response = await fetch("http://localhost:3333/employees");
  return await response.json();
}

export async function getPermissions() {
  const response = await fetch("http://localhost:3333/permissions");
  return await response.json();
}
