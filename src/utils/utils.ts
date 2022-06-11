import {ethers} from "ethers";

export type RequiredNonNull<T> = {
    [P in keyof T]-?: NonNullable<T[P]>;
};

export type Address = `0x${string}`;
export function normalizeAddress(address: Address): Address;
export function normalizeAddress(address: string): Address;
export function normalizeAddress(address: string): Address {
    return (address === "0x0"
        ? address
        : ethers.utils.getAddress(address)) as Address;
}
export const nativeTokenAddress: Address =
    "0x0000000000000000000000000000000000000000";
