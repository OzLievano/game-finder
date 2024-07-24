import { test as myTest, expect } from "@playwright/test";

type k = {
  age: number;
  email: string;
};

const myFixtureTest = myTest.extend<k>({
  age: 27,
  email: "osvaldolievano@gmail.com",
});

export const test = myFixtureTest;
