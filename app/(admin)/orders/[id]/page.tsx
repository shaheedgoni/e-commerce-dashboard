"use client";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Link from "next/link";
import {
  captilaze,
  formatDateTime,
  formatNaira,
  getInitials,
} from "@/lib/format";
import { ErrorState, Skeleton } from "@/components/ui/state";
import { ChangeOrderState, GetOrder } from "@/lib/services/order";
import { channelMap, orderStateMap } from "@/lib/statusMap";
import { TitleContext } from "@/lib/titleContext";
import { orderDetailProps } from "@/types/orderTypes";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Modal from "@/components/ui/modal";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<orderDetailProps | null>(null);
  const [loadError, setLoadError] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showCancel, setShowCancel] = useState(false);

  const { setTitle } = useContext(TitleContext);

  async function handleTransition(to: string) {
    setSaving(true);
    setMessage("");

    try {
      const updated = await ChangeOrderState(id, to);
      setOrder(updated);
    } catch {
      setMessage("Couldn't update the order. Try again.");
    }
    setSaving(false);
    setShowCancel(false);
  }

  useEffect(() => {
    async function load() {
      try {
        const data = await GetOrder(id);
        setOrder(data);
        setTitle(data.number);
      } catch {
        setLoadError(true);
      }
    }
    load();
  }, [id, setTitle]);

  if (loadError) {
    return (
      <div className="bg-surface border border-line rounded-xl">
        <ErrorState
          message="We couldn't load this order."
          onReentry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!order) {
    return <Skeleton className="h-8 w-64" />;
  }

  let initials = "";
  if (order.customer) {
    const parts = order.customer.name.split(" ");
    initials = getInitials(parts[0], parts[parts.length - 1]);
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/orders"
        className="text-lg text-ink-secondary hover:text-ink hover:underline w-fit flex items-center gap-1"
      >
        <ArrowLeft size={20} /> <span>Orders</span>
      </Link>

      {message ? (
        <div className="bg-red-50 border border-red-200 text-danger text-sm rounded-lg px-4 py-3">
          {message}
        </div>
      ) : null}

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-ink">{order.number}</h2>
            <Badge variant={orderStateMap[order.state].variant}>
              {orderStateMap[order.state].label}
            </Badge>
            <Badge variant={channelMap[order.channel].variant}>
              {channelMap[order.channel].label}
            </Badge>
          </div>
          <p className="text-sm text-ink-secondary mt-1">
            Placed {formatDateTime(order.placedAt)}
          </p>
        </div>

        <div className="flex gap-2">
          {order.state === "paid" || order.state === "pending_payment" ? (
            <Button
              variant="secondary"
              className="text-danger"
              onClick={() => setShowCancel(true)}
            >
              Cancel order
            </Button>
          ) : null}

          {order.state === "paid" ? (
            <Button
              loading={saving}
              onClick={() => handleTransition("shipped")}
            >
              Mark as shipped
            </Button>
          ) : null}

          {order.state === "shipped" ? (
            <Button
              loading={saving}
              onClick={() => handleTransition("delivered")}
            >
              Mark as delivered
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 items-start">
        <div className="col-span-2 flex flex-col gap-6">
          <Card>
            <h3 className="font-semibold text-ink px-5 pt-5 pb-3">
              Line items
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-ink-secondary border-y border-line">
                  <th className="text-left font-medium px-5 py-2.5">Product</th>
                  <th className="text-left font-medium px-5 py-2.5">SKU</th>
                  <th className="text-right font-medium px-5 py-2.5">
                    Unit price
                  </th>
                  <th className="text-right font-medium px-5 py-2.5">Qty</th>
                  <th className="text-right font-medium px-5 py-2.5">
                    Line total
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line) => (
                  <tr key={line.id} className="border-b border-line">
                    <td className="px-5 py-3">
                      <p className="font-medium text-ink">{line.productName}</p>
                      <p className="text-xs text-ink-secondary">
                        {line.variantName}
                      </p>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-ink-secondary">
                      {line.sku}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {formatNaira(line.unitPriceMinor)}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {line.quantity}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums font-medium">
                      {formatNaira(line.lineTotalMinor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end px-5 py-4">
              <div className="w-72 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-ink-secondary">
                  <span>Subtotal</span>
                  <span className="tabular-nums">
                    {formatNaira(order.subtotalMinor)}
                  </span>
                </div>
                <div className="flex justify-between text-ink-secondary">
                  <span>VAT (7.5%)</span>
                  <span className="tabular-nums">
                    {formatNaira(order.vatMinor)}
                  </span>
                </div>
                <div className="flex justify-between text-ink-secondary">
                  <span>Shipping</span>
                  <span className="tabular-nums">
                    {formatNaira(order.shippingMinor)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-ink border-t border-line pt-2">
                  <span>Total</span>
                  <span className="tabular-nums">
                    {formatNaira(order.totalMinor)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {order.payment ? (
            <Card className="p-5">
              <h3 className="font-semibold text-ink mb-4">Payment</h3>
              <div className="grid grid-cols-3 gap-y-4 text-sm">
                <div>
                  <p className="text-xs text-ink-secondary">Method</p>
                  <p className="text-ink mt-0.5">
                    {order.payment.provider === "fake"
                      ? "Online"
                      : captilaze(order.payment.provider)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ink-secondary">Status</p>
                  <div className="mt-0.5">
                    <Badge
                      variant={
                        order.payment.status === "approved"
                          ? "success"
                          : order.payment.status === "declined"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {captilaze(order.payment.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-ink-secondary">Reference</p>
                  <p className="font-mono text-xs text-ink mt-1">
                    {order.payment.reference}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ink-secondary">Amount</p>
                  <p className="text-ink mt-0.5 tabular-nums">
                    {formatNaira(order.payment.amountMinor)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ink-secondary">Date</p>
                  <p className="text-ink mt-0.5">
                    {formatDateTime(order.payment.createdAt)}
                  </p>
                </div>
              </div>
            </Card>
          ) : null}
        </div>

        <div className="flex flex-col gap-6">
          <Card className="p-5">
            <h3 className="font-semibold text-ink mb-4">Customer</h3>
            {order.customer ? (
              <div className="flex items-center gap-3">
                <span className="size-9 rounded-full bg-stone-100 text-ink-secondary text-xs font-semibold flex items-center justify-center">
                  {initials}
                </span>
                <div>
                  <p className="text-sm font-medium text-accent">
                    {order.customer.name}
                  </p>
                  <p className="text-xs text-ink-secondary">
                    {order.customer.email}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-ink">Walk-in</p>
                <p className="text-xs text-ink-secondary">
                  No customer account
                </p>
              </div>
            )}
          </Card>

          {order.shippingAddress ? (
            <Card className="p-5">
              <h3 className="font-semibold text-ink mb-3">Shipping address</h3>
              <div className="text-sm text-ink-secondary leading-6">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 ? (
                  <p>{order.shippingAddress.line2}</p>
                ) : null}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            </Card>
          ) : null}

          <Card className="p-5">
            <h3 className="font-semibold text-ink mb-4">Timeline</h3>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <span className="size-2 rounded-full bg-stone-400 mt-1.5" />
                <div>
                  <p className="text-sm text-ink">Placed</p>
                  <p className="text-xs text-ink-secondary">
                    {formatDateTime(order.placedAt)}
                  </p>
                </div>
              </div>
              {order.paidAt ? (
                <div className="flex gap-3">
                  <span className="size-2 rounded-full bg-blue-600 mt-1.5" />
                  <div>
                    <p className="text-sm text-ink">Paid</p>
                    <p className="text-xs text-ink-secondary">
                      {formatDateTime(order.paidAt)}
                    </p>
                  </div>
                </div>
              ) : null}
              {order.cancelledAt ? (
                <div className="flex gap-3">
                  <span className="size-2 rounded-full bg-danger mt-1.5" />
                  <div>
                    <p className="text-sm text-ink">Cancelled</p>
                    <p className="text-xs text-ink-secondary">
                      {formatDateTime(order.cancelledAt)}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </Card>
        </div>
      </div>

      {showCancel ? (
        <Modal
          title={`Cancel ${order.number}?`}
          subtitle="Stock for paid orders goes back. This can't be undone."
          onClose={() => setShowCancel(false)}
        >
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowCancel(false)}>
              Keep order
            </Button>

            <Button
              variant="danger"
              loading={saving}
              onClick={() => handleTransition("cancelled")}
            >
              Cancel order
            </Button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
