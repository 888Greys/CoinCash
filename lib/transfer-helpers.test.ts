import { describe, expect, test } from "bun:test";

import {
  formatTransferRecipientLabel,
  parseTransferRecipientInput,
  summarizeTransferActivity,
} from "./transfer-helpers";

describe("parseTransferRecipientInput", () => {
  test("treats a CoinCash ID as a numeric recipient identifier", () => {
    expect(parseTransferRecipientInput(" 8746484 ")).toEqual({
      kind: "user_uid",
      value: "8746484",
    });
  });

  test("treats an email address as a recipient email", () => {
    expect(parseTransferRecipientInput("USER@Example.com")).toEqual({
      kind: "email",
      value: "user@example.com",
    });
  });

  test("treats a handle as a username and strips the at sign", () => {
    expect(parseTransferRecipientInput("@Mathew")).toEqual({
      kind: "username",
      value: "mathew",
    });
  });

  test("returns null for empty recipient input", () => {
    expect(parseTransferRecipientInput("   ")).toBeNull();
  });
});

describe("formatTransferRecipientLabel", () => {
  test("prefers username when available", () => {
    expect(
      formatTransferRecipientLabel({
        username: "mathew",
        user_uid: 8746484,
        email: "mathew@example.com",
      })
    ).toBe("@mathew");
  });

  test("falls back to CoinCash ID", () => {
    expect(formatTransferRecipientLabel({ username: null, user_uid: 8746484, email: null })).toBe(
      "CoinCash ID 8746484"
    );
  });

  test("falls back to email when no username or ID is available", () => {
    expect(formatTransferRecipientLabel({ username: null, user_uid: null, email: "user@example.com" })).toBe(
      "user@example.com"
    );
  });
});

describe("summarizeTransferActivity", () => {
  test("returns the latest direct transfer and totals", () => {
    expect(
      summarizeTransferActivity([
        {
          type: "deposit",
          amount: 100,
          status: "completed",
          reference: null,
          created_at: "2026-04-18T09:00:00.000Z",
        },
        {
          type: "transfer_out",
          amount: 12.5,
          status: "completed",
          reference: "TRF-1",
          created_at: "2026-04-18T10:00:00.000Z",
        },
        {
          type: "transfer_in",
          amount: 7.25,
          status: "completed",
          reference: "TRF-2",
          created_at: "2026-04-18T11:00:00.000Z",
        },
      ])
    ).toEqual({
      latest: {
        type: "transfer_in",
        amount: 7.25,
        status: "completed",
        reference: "TRF-2",
        created_at: "2026-04-18T11:00:00.000Z",
      },
      sentCount: 1,
      receivedCount: 1,
      sentTotal: 12.5,
      receivedTotal: 7.25,
    });
  });

  test("returns null when there are no direct transfers", () => {
    expect(
      summarizeTransferActivity([
        {
          type: "deposit",
          amount: 100,
          status: "completed",
          reference: null,
          created_at: "2026-04-18T09:00:00.000Z",
        },
      ])
    ).toBeNull();
  });
});
