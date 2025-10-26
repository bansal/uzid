# Uzid

Uzid is a simple library for generating unique, sortable IDs based on a timestamp and random characters. It is designed to be lightweight and easy to use.

## Features

- **Unique**: Generates unique IDs with minimal collision risk
- **Sortable**: IDs are lexicographically sortable by generation time
- **Customizable**: Configurable base encoding, prefixes, and random suffix length
- **Lightweight**: Zero dependencies, ~1KB bundle size
- **TypeScript**: Full TypeScript support with type definitions

## Installation

You can install Uzid via npm:

```bash
npm install uzid
```

## Usage

### Basic Usage

```ts
import { Uzid } from "uzid";

// Create a Uzid instance
const uzid = new Uzid();

// Generate a single ID
const id = uzid.generate();
console.log(id); // e.g., "t3amzcxe4j"

// Generate multiple IDs using multiple method
const multipleIds = uzid.multiple(3);
console.log(multipleIds); // e.g., [ 't3an4ku74i', 't3an4kiwa4', 't3an4kyf6n' ]

// Generate random string only (without timestamp and prefix)
const randomStr = uzid.random();
console.log(randomStr); // e.g., "92f9" (only random characters, length based on configured length, default 4)
```

### Configuration Options

| Option      | Type              | Default   | Description                                                                 |
| ----------- | ----------------- | --------- | --------------------------------------------------------------------------- |
| `prefix`    | string            | `""`      | Prefix for identification across different sources                          |
| `base`      | 36 \| 62          | `36`      | Encoding base. 36 for alphanumeric, 62 for alphanumeric with uppercase      |
| `length`    | number            | `4`       | Length of the random part only (0-20), does not include prefix or timestamp |
| `precision` | "ms" \| undefined | undefined | Timestamp precision. "ms" for milliseconds, undefined for seconds           |

```ts
const postID = new Uzid({
  prefix: "post_", // prefix for identification, default ""
  base: 36, // Base for encoding (36 for alphanumeric, 62 for alphanumeric with uppercase) default 36
  length: 8, // length of random part only, default 4
  precision: "ms", // timestamp precision: "ms" for milliseconds, undefined for seconds
});
console.log(postID.generate()); // e.g., "post_mg3jlzxm7n8jbozs"
```

### Different Encoding Bases

```ts
// Alphanumeric (base 36) - default
const alphaUzid = new Uzid({ base: 36 });
console.log(alphaUzid.generate()); // e.g., "t3anaya15p"

// Alphanumeric with uppercase (base 62)
const fullUzid = new Uzid({ base: 62 });
console.log(fullUzid.generate()); // e.g., "1V2OuzUYKB"
```

### Timestamp Precision

Configure timestamp precision for different use cases:

```typescript
// Default: Second precision (less precise but shorter IDs)
const secondPrecision = new Uzid();
console.log(secondPrecision.generate()); // e.g., "t3anaya15p" length 10

// Millisecond precision (more precise but longer IDs)
const msPrecision = new Uzid({ precision: "ms" });
console.log(msPrecision.generate()); // e.g., "mg3jsynd4vpv" length 12
```

### Using Prefixes

Use prefixes to distinguish IDs from different sources, databases or tables:

```typescript
const serverUzid = new Uzid({ prefix: "srv1" });
const clientUzid = new Uzid({ prefix: "db0" });

console.log(serverUzid.generate()); // e.g., "srv1t3anaya15p"
console.log(clientUzid.generate()); // e.g., "db0t3anaya15p"
```

### Working with Random Strings

Generate random strings without timestamps or prefixes:

```ts
const uzid = new Uzid({ length: 6, base: 62 });

// Generate just a random string (no prefix, no timestamp)
const randomStr = uzid.random(); // e.g., "6TG5r3"
console.log(randomStr.length); // 6 (exactly the configured length)

// Compare with full ID generation
const fullId = uzid.generate(); // e.g., "1a2b3c4a3X9kL" (timestamp + random)
console.log(fullId.length); // > 6 (timestamp + random part)
```

### Bulk Generation

When you need to generate multiple unique IDs at once, calling `generate()` repeatedly within the same second can result in collisions. To guarantee uniqueness across multiple IDs, use `generate(count)` or `multiple(count)`:

```ts
const uzid = new Uzid();
console.log(uzid.generate(3)); // e.g., [ 't3ao7zhk3h', 't3ao7zqf8d', 't3ao7za2x2' ]
console.log(uzid.multiple(3)); // e.g., [ 't3ao7zhk3h', 't3ao7zqf8d', 't3ao7za2x2' ]
```

## API Reference

### Class: `Uzid`

#### Constructor

```ts
import { Uzid } from "uzid";
new Uzid(options?: UzidOptions)
```

#### Methods

##### `generate(): string`

Generates a single unique ID.

**Returns:** A unique ID string with timestamp and random suffix

##### `generate(count: number): string[]`

Generates an array of unique IDs.

**Parameters:**

- `count` - Number of IDs to generate (must be > 1)

**Returns:** Array of unique ID strings

##### `multiple(count: number): string[]`

Generates multiple unique IDs (alternative to `generate(count)`).

**Parameters:**

- `count` - Number of IDs to generate (must be > 1)

**Returns:** Array of unique ID strings

##### `random(): string`

Generates a random string without timestamp or prefix.

**Returns:** A random string of configured length using the configured base (contains only random characters)

##### `verify(id: string): boolean`

Verifies if a string is a valid ID generated by this Uzid instance.

**Parameters:**

- `id` - The ID string to verify

**Returns:** `true` if valid, `false` otherwise

### Interfaces

#### `UzidOptions`

```typescript
interface UzidOptions {
  prefix?: string; // Prefix for identification, default ""
  base?: 36 | 62; // Base for encoding (36 for alphanumeric, 62 for alphanumeric with uppercase), default 36
  length?: number; // Length of random part only (0-20), does not include prefix or timestamp, default 4
  precision?: "ms"; // Timestamp precision: "ms" for milliseconds, undefined for seconds, default undefined
}
```

## ID Structure

Each generated ID consists of:

1. **Prefix** (optional): User-defined string for identification
2. **Timestamp**: Encoded timestamp (seconds by default, or milliseconds if precision is "ms")
3. **Random part**: Random characters for uniqueness (length configured by the `length` option)

Example: `srv1` + `t3ao7zhk3h` + `d4e5`

Note: The `length` configuration only affects the random part, not the total ID length.

## Sortable IDs

IDs are lexicographically sortable by generation time due to the timestamp-based prefix:

```ts
const uzid = new Uzid();
const ids = [
  uzid.generate(),
  // ... wait some time ...
  uzid.generate(),
];

console.log(ids[1] > ids[0]); // true (newer ID is lexicographically greater)
```

## License

MIT

## Author

[Jiten Bansal](https://bansal.io)
