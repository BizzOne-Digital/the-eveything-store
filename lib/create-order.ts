import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Customer } from "@/models/Customer";
import { generateOrderNumber } from "@/lib/utils";

export interface OrderItemInput {
  productId?: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface OrderCustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  deliveryNotes?: string;
}

export async function persistOrder(
  customer: OrderCustomerInput,
  items: OrderItemInput[],
  paymentMethod: string,
  paymentStatus: "pending" | "paid" | "failed"
) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  await connectDB();

  let orderNumber = generateOrderNumber();
  for (let attempt = 0; attempt < 3; attempt++) {
    const exists = await Order.findOne({ orderNumber }).lean();
    if (!exists) break;
    orderNumber = generateOrderNumber();
  }

  const order = await Order.create({
    orderNumber,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
    province: customer.province,
    postalCode: customer.postalCode,
    deliveryNotes: customer.deliveryNotes || undefined,
    items: items.map((item) => ({
      product: item.productId || undefined,
      name: item.name,
      image: item.image || "",
      price: item.price,
      quantity: item.quantity,
    })),
    subtotal,
    total,
    paymentMethod,
    paymentStatus,
    status: "New",
  });

  const existingCustomer = await Customer.findOne({ email: customer.email });
  if (existingCustomer) {
    existingCustomer.ordersCount += 1;
    existingCustomer.totalSpent += total;
    existingCustomer.firstName = customer.firstName;
    existingCustomer.lastName = customer.lastName;
    existingCustomer.phone = customer.phone;
    existingCustomer.address = customer.address;
    existingCustomer.city = customer.city;
    existingCustomer.province = customer.province;
    existingCustomer.postalCode = customer.postalCode;
    await existingCustomer.save();
  } else {
    await Customer.create({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      province: customer.province,
      postalCode: customer.postalCode,
      ordersCount: 1,
      totalSpent: total,
    });
  }

  return order;
}
