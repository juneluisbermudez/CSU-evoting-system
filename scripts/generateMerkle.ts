import { supabase } from '@/lib/supabase';
import keccak256 from 'keccak256';
import { MerkleTree } from 'merkletreejs';

type Vote = {
  student_id: string;
  candidate_id: string;
  position_id: string;
  school_year: string;
};

const hashVote = (vote: Vote): Buffer => {
  // Make sure it’s consistent and unique
  const data = `${vote.student_id}-${vote.candidate_id}-${vote.position_id}-${vote.school_year}`;
  return keccak256(data);
};

const generateMerkleRoot = async () => {
  const { data: votes, error } = await supabase
    .from('votes')
    .select('student_id, candidate_id, position_id, school_year');

  if (error || !votes || votes.length === 0) {
    console.error('❌ Failed to fetch votes or no votes found:', error);
    return;
  }

  const leaves = votes.map(hashVote);
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const root = tree.getHexRoot();

  console.log('✅ Merkle Root:', root);
  return {
    root,
    tree,
    leaves,
    votes
  };
};

// Run it directly
generateMerkleRoot();
