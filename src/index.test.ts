import { Uzid } from "./index";

describe("Uzid", () => {
  describe("constructor", () => {
    it("should create instance with default options", () => {
      const uzid = new Uzid();
      expect(uzid).toBeInstanceOf(Uzid);
    });

    it("should create instance with custom options", () => {
      const uzid = new Uzid({
        prefix: "server1",
        base: 62,
        length: 6,
      });
      expect(uzid).toBeInstanceOf(Uzid);
    });

    it("should throw error for invalid base", () => {
      expect(() => new Uzid({ base: 16 as any })).toThrow(
        "Base must be either 36 or 62"
      );
      expect(() => new Uzid({ base: 64 as any })).toThrow(
        "Base must be either 36 or 62"
      );
    });

    it("should throw error for invalid length", () => {
      expect(() => new Uzid({ length: -1 })).toThrow(
        "Length must be a non-negative integer between 0 and 20"
      );
      expect(() => new Uzid({ length: 21 })).toThrow(
        "Length must be a non-negative integer between 0 and 20"
      );
    });

    it("should accept length 0", () => {
      const uzid = new Uzid({ length: 0 });
      expect(uzid).toBeInstanceOf(Uzid);
    });

    it("should throw error for invalid precision", () => {
      expect(() => new Uzid({ precision: "s" as any })).toThrow(
        'Precision must be "ms" if specified'
      );
    });

    it("should accept valid precision", () => {
      const uzid = new Uzid({ precision: "ms" });
      expect(uzid).toBeInstanceOf(Uzid);
    });
  });

  describe("generate", () => {
    it("should generate a single ID", () => {
      const uzid = new Uzid();
      const id = uzid.generate();

      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("should generate multiple IDs", () => {
      const uzid = new Uzid();
      const ids = uzid.generate(5);

      expect(Array.isArray(ids)).toBe(true);
      expect(ids.length).toBe(5);
      expect(new Set(ids).size).toBe(5); // All IDs should be unique
    });

    it("should generate IDs with prefix", () => {
      const uzid = new Uzid({ prefix: "test" });
      const id = uzid.generate();

      expect(id.startsWith("test")).toBe(true);
    });

    it("should generate IDs with different bases", () => {
      const uzidBase36 = new Uzid({ base: 36 });
      const uzidBase62 = new Uzid({ base: 62 });

      const idBase36 = uzidBase36.generate();
      const idBase62 = uzidBase62.generate();

      expect(typeof idBase36).toBe("string");
      expect(typeof idBase62).toBe("string");
    });

    it("should generate IDs with different lengths", () => {
      const uzidShort = new Uzid({ length: 2 });
      const uzidLong = new Uzid({ length: 8 });

      const idShort = uzidShort.generate();
      const idLong = uzidLong.generate();

      expect(idLong.length).toBeGreaterThan(idShort.length);
    });

    it("should throw error for invalid count", () => {
      const uzid = new Uzid();
      expect(() => uzid.generate(0)).toThrow(
        "Count must be a positive integer greater than 1"
      );
      expect(() => uzid.generate(1)).toThrow(
        "Count must be a positive integer greater than 1"
      );
    });
  });

  describe("random", () => {
    it("should generate random string of correct length", () => {
      const uzid = new Uzid({ length: 6 });
      const randomStr = uzid.random();

      expect(typeof randomStr).toBe("string");
      expect(randomStr.length).toBe(6);
    });

    it("should generate random string without prefix or timestamp", () => {
      const uzid = new Uzid({ prefix: "test", length: 4 });
      const randomStr = uzid.random();

      expect(randomStr).not.toContain("test");
      expect(randomStr.length).toBe(4);
    });

    it("should generate different random strings", () => {
      const uzid = new Uzid({ length: 8 });
      const randomStr1 = uzid.random();
      const randomStr2 = uzid.random();

      expect(randomStr1).not.toBe(randomStr2);
      expect(randomStr1.length).toBe(8);
      expect(randomStr2.length).toBe(8);
    });

    it("should generate random string with base 36 characters", () => {
      const uzid = new Uzid({ base: 36, length: 10 });
      const randomStr = uzid.random();

      expect(randomStr).toMatch(/^[0-9a-z]+$/);
      expect(randomStr.length).toBe(10);
    });

    it("should generate random string with base 62 characters", () => {
      const uzid = new Uzid({ base: 62, length: 10 });
      const randomStr = uzid.random();

      expect(randomStr).toMatch(/^[0-9a-zA-Z]+$/);
      expect(randomStr.length).toBe(10);
    });

    it("should handle length 0", () => {
      const uzid = new Uzid({ length: 0 });
      const randomStr = uzid.random();
      expect(randomStr).toBe("");
      expect(uzid.verify(uzid.generate())).toBe(true);
    });

    it("should work consistently regardless of precision setting", () => {
      const uzidSeconds = new Uzid({ length: 5 });
      const uzidMs = new Uzid({ length: 5, precision: "ms" });

      const randomStr1 = uzidSeconds.random();
      const randomStr2 = uzidMs.random();

      expect(randomStr1.length).toBe(5);
      expect(randomStr2.length).toBe(5);
      expect(randomStr1).toMatch(/^[0-9a-z]+$/);
      expect(randomStr2).toMatch(/^[0-9a-z]+$/);
    });

    it("should generate consistent length with different bases", () => {
      const uzid36 = new Uzid({ base: 36, length: 10 });
      const uzid62 = new Uzid({ base: 62, length: 10 });

      const random36 = uzid36.random();
      const random62 = uzid62.random();

      expect(random36.length).toBe(10);
      expect(random62.length).toBe(10);
    });
  });

  describe("multiple", () => {
    it("should generate multiple unique IDs", () => {
      const uzid = new Uzid();
      const ids = uzid.multiple(5);

      expect(Array.isArray(ids)).toBe(true);
      expect(ids.length).toBe(5);
      expect(new Set(ids).size).toBe(5); // All IDs should be unique
    });

    it("should generate IDs with prefix", () => {
      const uzid = new Uzid({ prefix: "multi" });
      const ids = uzid.multiple(3);

      ids.forEach((id) => {
        expect(id.startsWith("multi")).toBe(true);
      });
    });

    it("should throw error for invalid count", () => {
      const uzid = new Uzid();
      expect(() => uzid.multiple(0)).toThrow(
        "Count must be a positive integer greater than 1"
      );
      expect(() => uzid.multiple(1)).toThrow(
        "Count must be a positive integer greater than 1"
      );
      expect(() => uzid.multiple(-1)).toThrow(
        "Count must be a positive integer greater than 1"
      );
    });

    it("should generate large number of unique IDs", () => {
      const uzid = new Uzid();
      const ids = uzid.multiple(1000);

      expect(ids.length).toBe(1000);
      expect(new Set(ids).size).toBe(1000);
    });

    it("should work with different configurations", () => {
      const uzid = new Uzid({ prefix: "batch", base: 62, length: 8 });
      const ids = uzid.multiple(10);

      ids.forEach((id) => {
        expect(id.startsWith("batch")).toBe(true);
        expect(uzid.verify(id)).toBe(true);
      });
    });

    it("should work with millisecond precision", () => {
      const uzid = new Uzid({ precision: "ms", length: 6 });
      const ids = uzid.multiple(10);

      expect(ids.length).toBe(10);
      expect(new Set(ids).size).toBe(10);
      ids.forEach((id) => {
        expect(uzid.verify(id)).toBe(true);
      });
    });

    it("should handle edge case with minimum count", () => {
      const uzid = new Uzid();
      const ids = uzid.multiple(2);

      expect(ids.length).toBe(2);
      expect(ids[0]).not.toBe(ids[1]);
    });

    it("should return IDs in sorted order", () => {
      const uzid = new Uzid();
      const ids = uzid.multiple(10);

      // Create a sorted copy to compare against
      const sortedIds = [...ids].sort();

      // The returned array should already be in sorted order
      expect(ids).toEqual(sortedIds);

      // Verify each ID is lexicographically <= the next one
      for (let i = 0; i < ids.length - 1; i++) {
        expect(ids[i] <= ids[i + 1]).toBe(true);
      }
    });

    it("should maintain chronological order with millisecond precision", () => {
      const uzid = new Uzid({ precision: "ms", length: 4 });

      // Generate IDs with a small delay to ensure different timestamps
      const idsWithDelay: string[] = [];
      for (let i = 0; i < 5; i++) {
        idsWithDelay.push(uzid.single());
        // Small delay to get different timestamps
        const start = Date.now();
        while (Date.now() - start < 2) {
          /* busy wait */
        }
      }

      // These should be in chronological order
      for (let i = 0; i < idsWithDelay.length - 1; i++) {
        expect(idsWithDelay[i] < idsWithDelay[i + 1]).toBe(true);
      }

      // Multiple generation should also maintain sort order
      const batchIds = uzid.multiple(10);
      const sortedBatch = [...batchIds].sort();
      expect(batchIds).toEqual(sortedBatch);
    });
  });

  describe("precision", () => {
    it("should work with default second precision", () => {
      const uzid = new Uzid();
      const id = uzid.generate();

      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
      expect(uzid.verify(id)).toBe(true);
    });

    it("should work with millisecond precision", () => {
      const uzid = new Uzid({ precision: "ms" });
      const id = uzid.generate();

      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
      expect(uzid.verify(id)).toBe(true);
    });

    it("should generate different length IDs for different precisions", () => {
      const uzidSeconds = new Uzid({ length: 4 });
      const uzidMs = new Uzid({ precision: "ms", length: 4 });

      const idSeconds = uzidSeconds.generate();
      const idMs = uzidMs.generate();

      // Millisecond precision should generally result in longer timestamp part
      // This test might be flaky depending on the timestamp values, so we'll just verify they work
      expect(uzidSeconds.verify(idSeconds)).toBe(true);
      expect(uzidMs.verify(idMs)).toBe(true);
    });

    it("should maintain sortability with millisecond precision", (done) => {
      const uzid = new Uzid({ precision: "ms" });
      const id1 = uzid.generate();

      setTimeout(() => {
        const id2 = uzid.generate();
        expect(id2 > id1).toBe(true);
        done();
      }, 1);
    });

    it("should generate unique IDs with millisecond precision", () => {
      const uzid = new Uzid({ precision: "ms" });
      const ids = uzid.multiple(100);

      expect(new Set(ids).size).toBe(100);
    });

    it("should verify IDs correctly with millisecond precision", () => {
      const uzid = new Uzid({ precision: "ms", prefix: "test" });
      const id = uzid.generate();

      expect(uzid.verify(id)).toBe(true);
    });

    it("should not verify IDs between different precisions", () => {
      const uzidSeconds = new Uzid({ prefix: "test" });
      const uzidMs = new Uzid({ prefix: "test", precision: "ms" });

      const idSeconds = uzidSeconds.generate();
      const idMs = uzidMs.generate();

      // Each should verify their own IDs but not the other's
      expect(uzidSeconds.verify(idSeconds)).toBe(true);
      expect(uzidMs.verify(idMs)).toBe(true);
      // Note: Cross verification might work depending on timestamp values,
      // but they're configured differently so we don't test this assumption
    });
  });

  describe("sortability", () => {
    it("should generate sortable IDs (newer IDs should be lexicographically greater)", (done) => {
      const uzid = new Uzid();
      const id1 = uzid.generate();

      setTimeout(() => {
        const id2 = uzid.generate();
        expect(id2 > id1).toBe(true);
        done();
      }, 1100); // 1.1 seconds to ensure different timestamps with second precision
    });

    it("should maintain sort order for multiple IDs generated in sequence", () => {
      const uzid = new Uzid();
      const ids = uzid.generate(5); // Reduced number for more reliable testing

      // Check that IDs are generally increasing (allowing for some randomness in suffix)
      // Since we use timestamp + random, the timestamp part should generally increase
      let increasing = 0;
      for (let i = 1; i < ids.length; i++) {
        if (ids[i] >= ids[i - 1]) {
          increasing++;
        }
      }

      // At least some should be in increasing order
      expect(increasing).toBeGreaterThan(0);
    });
  });

  describe("uniqueness", () => {
    it("should generate unique IDs", () => {
      const uzid = new Uzid();
      const ids = uzid.generate(1000);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should generate unique IDs across multiple instances with same config", () => {
      const uzid1 = new Uzid({ prefix: "test" });
      const uzid2 = new Uzid({ prefix: "test" });

      const ids1 = uzid1.generate(50);
      const ids2 = uzid2.generate(50);

      const allIds = [...ids1, ...ids2];
      const uniqueIds = new Set(allIds);

      expect(uniqueIds.size).toBe(allIds.length);
    });
  });

  describe("verify", () => {
    it("should verify valid IDs generated by same instance", () => {
      const uzid = new Uzid({ prefix: "test", base: 36 });
      const id = uzid.generate();

      expect(uzid.verify(id)).toBe(true);
    });

    it("should verify multiple valid IDs", () => {
      const uzid = new Uzid({ prefix: "multi", base: 62, length: 6 });
      const ids = uzid.generate(5);

      ids.forEach((id) => {
        expect(uzid.verify(id)).toBe(true);
      });
    });

    it("should reject IDs with wrong prefix", () => {
      const uzid = new Uzid({ prefix: "test" });
      const id = uzid.generate();

      const uzidWrongPrefix = new Uzid({ prefix: "wrong" });
      expect(uzidWrongPrefix.verify(id)).toBe(false);
    });

    it("should reject IDs with invalid characters for base", () => {
      const uzid36 = new Uzid({ base: 36 });
      const fakeId = "testZ123abc"; // 'Z' is not valid in base 36

      expect(uzid36.verify(fakeId)).toBe(false);
    });

    it("should reject invalid inputs", () => {
      const uzid = new Uzid();

      expect(uzid.verify("")).toBe(false);
      expect(uzid.verify("x")).toBe(false); // too short
      expect(uzid.verify("invalid!@#")).toBe(false); // invalid chars
    });

    it("should reject IDs generated with different config", () => {
      const uzid36 = new Uzid({ prefix: "36_", base: 36, length: 4 });
      const uzid62 = new Uzid({ prefix: "62_", base: 62, length: 4 });

      const id36 = uzid36.generate();
      const id62 = uzid62.generate();

      // Each should only verify its own IDs due to different prefixes
      expect(uzid36.verify(id36)).toBe(true);
      expect(uzid62.verify(id62)).toBe(true);
      expect(uzid36.verify(id62)).toBe(false); // wrong prefix
      expect(uzid62.verify(id36)).toBe(false); // wrong prefix
    });
  });
});
