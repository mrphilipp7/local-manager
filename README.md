# local-manager

A type-safe package that delivers helper functions to make dealing with local storage easier.

Functions include

1. writing
   Using the 'write' method you can enter things into localstorage

```typescript
LocalStorage.write({ key: 'Hello', value: 'World' });
```

2. reading
   To read values in localstorage we only need use the 'read' method

```typescript
LocalStorage.read('hello');
```

3. delete
   To remove values in localstorage we use the 'delete' method

```typescript
LocalStorage.delete('hello');
```

4. clear
   If you want wipe the slate clean, use 'clear'

```typescript
LocalStorage.clear();
```

5. update
   While updating is essentially writing to local storage, this will provide feedback on if you are trying to update a value that doesn't exist.

```typescript
LocalStorage.update({ key: 'hello', value: 'computer' });
```

6. has
   Check and see if the key/value pair exists

```typescript
LocalStorage.clear();
```

7. writeWithExpiry
   Write to local storage but attach a time to the payload to set an expiration date.

```typescript
LocalStorage.writeWithExpiry({ key: 'Hello', value: 'World', ttl: 10 }); // number is adding milliseconds to current time Date.now() + ttl
```

8. readWithExpiry
   Lets you read from storage and check for key/values that have an expiration time.

```typescript
LocalStorage.readWithExpiry('hello');
```

9. cleanExpired
   Go through all of storage to find and remove any expired values

```typescript
LocalStorage.cleanExpired();
```
