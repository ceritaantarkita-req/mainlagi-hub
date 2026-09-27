import "server-only";

import policyJson from "./operational-policy.json";

export type OperationalPolicyBlocker = {
  code: string;
  message: string;
};

type OperationalPolicyContract = {
  version: string;
  status: "pending_owner_input" | "approved";
  currentImplementedBehavior: {
    paymentExpiryMinutes: number;
    shippingQuoteExpiryMinutes: number;
    collectionMethod: string;
    shippingType: string;
    instantServiceAllowed: boolean;
    partialRefundHandling: string;
    guestOrderAccess: string;
    outboundCustomerNotifications: string;
  };
  ownerDecisions: {
    pickupOrigin: {
      approved: boolean;
      storage: string;
      requiredFields: string[];
      note: string;
    };
    courierAllowlist: {
      approved: boolean;
      couriers: string[];
      allowedServiceClass: {
        shippingType: string;
        collectionMethod: string;
        instantAllowed: boolean;
      };
    };
    packingHandling: {
      approved: boolean;
      handlingFeeAmount: number | null;
      packingRule: string | null;
    };
    support: {
      approved: boolean;
      channel: string | null;
      contact: string | null;
      hours: string | null;
    };
    paymentExpiry: {
      approved: boolean;
      minutes: number | null;
      implementedMinutes: number;
    };
    cancellation: { approved: boolean; publicPolicy: string | null };
    returnExchange: { approved: boolean; publicPolicy: string | null };
    refund: {
      approved: boolean;
      publicPolicy: string | null;
      partialRefundMode: string;
    };
    sla: {
      approved: boolean;
      processing: string | null;
      shipping: string | null;
      refund: string | null;
    };
    guestOrderRecovery: {
      approved: boolean;
      mode: string | null;
      note: string;
    };
    customerNotifications: {
      approved: boolean;
      channels: string[];
      note: string;
    };
    exceptionHandling: {
      approved: boolean;
      damaged: string | null;
      wrongItem: string | null;
      lostShipment: string | null;
      delayedShipment: string | null;
      ambiguousProviderState: string;
    };
  };
};

type EnvLike = Record<string, string | undefined>;

export const operationalPolicy =
  policyJson as OperationalPolicyContract;

const text = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const approvedText = (approved: unknown, value: unknown) =>
  approved === true && text(value).length > 0;

function normalizedCouriers(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .sort();
}

export function operationalEnvironmentStatus(env: EnvLike = process.env) {
  const origin = {
    contactName: Boolean(text(env.BITESHIP_ORIGIN_CONTACT_NAME)),
    contactPhone: /^\+?[0-9]{9,15}$/.test(
      text(env.BITESHIP_ORIGIN_CONTACT_PHONE),
    ),
    address: Boolean(text(env.BITESHIP_ORIGIN_ADDRESS)),
    postalCode: /^\d{5}$/.test(text(env.BITESHIP_ORIGIN_POSTAL_CODE)),
  };
  const configuredCouriers = normalizedCouriers(env.BITESHIP_COURIERS);
  return {
    origin,
    configuredCouriers,
    originReady: Object.values(origin).every(Boolean),
  };
}

export function operationalPolicyBlockers(
  env: EnvLike = process.env,
): OperationalPolicyBlocker[] {
  const blockers: OperationalPolicyBlocker[] = [];
  const decision = operationalPolicy.ownerDecisions;
  const environment = operationalEnvironmentStatus(env);

  const add = (code: string, message: string) =>
    blockers.push({ code, message });

  if (operationalPolicy.status !== "approved")
    add(
      "policy_not_approved",
      "Kontrak operasional belum mendapat approval owner.",
    );

  if (decision.pickupOrigin.approved !== true)
    add(
      "pickup_origin_not_approved",
      "Pickup/warehouse origin dan sender contact belum disetujui.",
    );
  if (!environment.originReady)
    add(
      "pickup_origin_not_configured",
      "Environment pickup origin Biteship belum lengkap atau formatnya tidak valid.",
    );

  if (
    decision.courierAllowlist.approved !== true ||
    decision.courierAllowlist.couriers.length === 0
  )
    add(
      "couriers_not_approved",
      "Courier allowlist belum disetujui.",
    );
  else {
    const approved = [...decision.courierAllowlist.couriers]
      .map((item) => item.toLowerCase())
      .sort();
    if (
      approved.length !== environment.configuredCouriers.length ||
      approved.some(
        (item, index) => item !== environment.configuredCouriers[index],
      )
    )
      add(
        "couriers_env_mismatch",
        "BITESHIP_COURIERS harus sama persis dengan courier allowlist yang disetujui.",
      );
  }

  if (
    decision.packingHandling.approved !== true ||
    typeof decision.packingHandling.handlingFeeAmount !== "number" ||
    decision.packingHandling.handlingFeeAmount < 0 ||
    !text(decision.packingHandling.packingRule)
  )
    add(
      "packing_policy_missing",
      "Aturan packing/handling belum final.",
    );

  if (
    !approvedText(decision.support.approved, decision.support.channel) ||
    !text(decision.support.contact) ||
    !text(decision.support.hours)
  )
    add(
      "support_policy_missing",
      "Channel, kontak, dan jam layanan customer support belum final.",
    );

  if (
    decision.paymentExpiry.approved !== true ||
    decision.paymentExpiry.minutes !==
      operationalPolicy.currentImplementedBehavior.paymentExpiryMinutes
  )
    add(
      "payment_expiry_unapproved",
      "Payment expiry belum disetujui atau belum sama dengan implementasi 30 menit.",
    );

  if (
    !approvedText(
      decision.cancellation.approved,
      decision.cancellation.publicPolicy,
    )
  )
    add("cancellation_policy_missing", "Kebijakan pembatalan belum final.");

  if (
    !approvedText(
      decision.returnExchange.approved,
      decision.returnExchange.publicPolicy,
    )
  )
    add(
      "return_exchange_policy_missing",
      "Kebijakan retur/penukaran belum final.",
    );

  if (
    !approvedText(decision.refund.approved, decision.refund.publicPolicy) ||
    decision.refund.partialRefundMode !== "manual_review"
  )
    add("refund_policy_missing", "Kebijakan refund belum final.");

  if (
    decision.sla.approved !== true ||
    !text(decision.sla.processing) ||
    !text(decision.sla.shipping) ||
    !text(decision.sla.refund)
  )
    add("sla_missing", "SLA processing, shipping, dan refund belum final.");

  if (
    decision.guestOrderRecovery.approved !== true ||
    !text(decision.guestOrderRecovery.mode)
  )
    add(
      "guest_recovery_missing",
      "Keputusan guest order recovery belum final.",
    );

  if (
    decision.customerNotifications.approved !== true ||
    !Array.isArray(decision.customerNotifications.channels)
  )
    add(
      "notification_policy_missing",
      "Keputusan customer notification belum final.",
    );

  if (
    decision.exceptionHandling.approved !== true ||
    !text(decision.exceptionHandling.damaged) ||
    !text(decision.exceptionHandling.wrongItem) ||
    !text(decision.exceptionHandling.lostShipment) ||
    !text(decision.exceptionHandling.delayedShipment) ||
    decision.exceptionHandling.ambiguousProviderState !== "manual_review"
  )
    add(
      "exception_policy_missing",
      "Penanganan damaged/wrong/lost/delayed shipment belum final.",
    );

  return blockers;
}

export function operationalPolicyReady(env: EnvLike = process.env) {
  return operationalPolicyBlockers(env).length === 0;
}

export function operationalPolicySafeSummary(env: EnvLike = process.env) {
  const environment = operationalEnvironmentStatus(env);
  return {
    version: operationalPolicy.version,
    status: operationalPolicy.status,
    currentImplementedBehavior: operationalPolicy.currentImplementedBehavior,
    ownerDecisions: operationalPolicy.ownerDecisions,
    environment: {
      originReady: environment.originReady,
      originFields: environment.origin,
      configuredCouriers: environment.configuredCouriers,
    },
    blockers: operationalPolicyBlockers(env),
  };
}
