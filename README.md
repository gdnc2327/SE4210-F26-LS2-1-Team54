# Learning Sprint 2 Problem 1

## Team 54

A visualization of a buffer overflow from a string of size 7 (including null byte)

The visual is broken into 4&ndash;5 parts:
1. **Buffer**: a `char` array of size 7
2. **Padding**: miscellaneous values between declared variables and the stack base pointer; may include an optional canary
3. **Stack Base Pointer**: a 4-byte "register" representing the value of `%ebp`
4. **Instruction Pointer**: a 4-byte "register" representing the value of `%eip`
5. **Malware** *(optional)*: represents malware in the system (provided with its memory address for convenience)
