"use strict";

const shipItApi = require("../shipItApi");
shipItApi.shipProduct = jest.fn();

const request = require("supertest");
const app = require("../app");

describe("POST /", function () {
  test("valid", async function () {
    shipItApi.shipProduct.mockReturnValue(5555);

    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: 5555 });
  });

  /** Should throw error if no request body */
  test("throws error if empty request body", async function () {
    const resp = await request(app).post("/shipments").send();

    expect(resp.statusCode).toEqual(400);
  });

  /** Should throw error if missing inputs */
  test("throws error if missing an input", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 2000,
      name: "diane",
    });

    expect(resp.statusCode).toEqual(400);

    expect(resp.body.error.message).toEqual([
      'instance requires property "addr"',
      'instance requires property "zip"',
    ]);
  });
});
