import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import VoteProofABI from './VoteProofABI.json';

const CONTRACT_ADDRESS = '0xd9145CCE52D386f254917e481eB44e9943F39138';

export async function submitMerkleRootToBlockchain(merkleRoot: string) {
  const provider = await detectEthereumProvider();

  if (!provider || !('request' in provider)) {
    throw new Error('MetaMask not detected');
  }

  // Ask MetaMask to connect
  await (provider as any).request({ method: 'eth_requestAccounts' });

  const ethersProvider = new ethers.BrowserProvider(provider as any);
  const signer = await ethersProvider.getSigner();

  const contract = new ethers.Contract(CONTRACT_ADDRESS, VoteProofABI, signer);
  const tx = await contract.submitMerkleRoot(merkleRoot);
  await tx.wait();

  return tx.hash;
}
