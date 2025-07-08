import { ethers } from 'ethers';
import { supabase } from '../lib/supabase';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import * as dotenv from 'dotenv';

dotenv.config();

type Vote = {
  student_id: string;
  candidate_id: string;
  position_id: string;
  school_year: string;
};

const CONTRACT_ABI = [
  'function storeRoot(bytes32 _root) public',
  'function merkleRoot() public view returns (bytes32)',
];

const hashVote = (vote: Vote): Buffer => {
  const data = `${vote.student_id}-${vote.candidate_id}-${vote.position_id}-${vote.school_year}`;
  return keccak256(data);
};

async function submitMerkleRoot() {
  // 1. Fetch votes
  const { data: votes, error } = await supabase
    .from('votes')
    .select('student_id, candidate_id, position_id, school_year');

  if (error || !votes || votes.length === 0) {
    console.error('❌ Failed to fetch votes or no votes found:', error);
    return;
  }

  // 2. Build Merkle Tree
  const leaves = votes.map(hashVote);
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const root = tree.getHexRoot();
  console.log('✅ Merkle Root:', root);

  // 3. Submit to Ethereum
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS!, CONTRACT_ABI, wallet);

  console.log('⏳ Sending transaction...');
  const tx = await contract.storeRoot(root);
  await tx.wait();

  console.log('✅ Merkle root stored on-chain:', tx.hash);

  // 4. Log root in Supabase
  const { error: insertError } = await supabase.from('vote_roots').insert([
    {
      root,
      tx_hash: tx.hash,
      school_year: votes[0].school_year,
    },
  ]);

  if (insertError) {
    console.error('⚠️ Failed to insert root in Supabase:', insertError);
  } else {
    console.log('📦 Merkle root saved to Supabase.');
  }
}

submitMerkleRoot();
