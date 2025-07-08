import { keccak_256 } from '@noble/hashes/sha3';
import { MerkleTree } from 'merkletreejs';

export function generateMerkleRoot(votes: { position_id: string; candidate_ids: string[] }[]): string {
  const leaves = votes.map(vote => {
    const sorted = [...vote.candidate_ids].sort().join(',');
    const leafString = `${vote.position_id}:${sorted}`;
    const hash = keccak_256(new TextEncoder().encode(leafString));
    return Buffer.from(hash);
  });

  const tree = new MerkleTree(leaves, keccak_256, { sortPairs: true });
  const root = tree.getRoot().toString('hex');
  return '0x' + root;
}
