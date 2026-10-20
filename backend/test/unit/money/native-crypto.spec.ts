import { deriveAddress, fiatToSats, formatSats } from '../../../src/modules/money/adapters/btc.adapter';
import { isEthereumAddress } from '../../../src/modules/money/adapters/eth-usdt.adapter';

describe('Bitcoin address derivation', () => {
  // Account keys of the BIP39 test mnemonic "abandon … about" (BIP44/49/84 test vectors).
  const zpub = 'zpub6rFR7y4Q2AijBEqTUquhVz398htDFrtymD9xYYfG1m4wAcvPhXNfE3EfH1r1ADqtfSdVCToUG868RvUUkgDKf31mGDtKsAYz2oz2AGutZYs';
  const ypub = 'ypub6Ww3ibxVfGzLrAH1PNcjyAWenMTbbAosGNB6VvmSEgytSER9azLDWCxoJwW7Ke7icmizBMXrzBx9979FfaHxHcrArf3zbeJJJUZPf663zsP';
  const xpub = 'xpub6BosfCnifzxcFwrSzQiqu2DBVTshkCXacvNsWGYJVVhhawA7d4R5WSWGFNbi8Aw6ZRc1brxMyWMzG3DSSSSoekkudhUd9yLb6qx39T9nMdj';

  it('derives the same receive addresses as the merchant wallet', () => {
    expect(deriveAddress(zpub, 0).address).toBe('bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu');
    expect(deriveAddress(zpub, 1).address).toBe('bc1qnjg0jd8228aq7egyzacy8cys3knf9xvrerkf9g');
    expect(deriveAddress(ypub, 0).address).toBe('37VucYSaXLCAsxYyAPfbSi9eh4iEcbShgf');
    expect(deriveAddress(xpub, 0, 'p2pkh').address).toBe('1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA');
  });

  it('refuses keys it cannot use', () => {
    expect(() => deriveAddress('xprv9s21ZrQH143K3GJpoapnV8SFfukcVBSfeCficPSGfubmSFDxo1kuHnLisriDvSnRRuL2Qrg5ggqHKNVpxR86QEC8w35uxmGoggxtQTPvfUu', 0)).toThrow(
      /extended public key/,
    );
    expect(() => deriveAddress('zpub-not-a-key', 0)).toThrow();
  });
});

describe('Bitcoin quotes', () => {
  it('converts a fiat amount to satoshis, rounding up', () => {
    expect(fiatToSats('100000', '250000000')).toBe(40000n); // 100,000 UGX at 250M UGX/BTC
    expect(fiatToSats('10', '60000.5')).toBe(16667n);
    expect(formatSats(40000n)).toBe('0.0004');
    expect(formatSats(100000000n)).toBe('1');
  });
});

describe('Ethereum addresses', () => {
  it('checks EIP-55 checksums on mixed-case addresses', () => {
    expect(isEthereumAddress('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed')).toBe(true);
    expect(isEthereumAddress('0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed')).toBe(true);
    expect(isEthereumAddress('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAeD')).toBe(false);
    expect(isEthereumAddress('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t')).toBe(false);
  });
});
