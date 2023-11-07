import {apiClient} from "../../contexts/ConfigContext";
import {
    signAndDeployClaim,
    signAndDeployDeposit,
    signAndDeployWithdraw,
    signAndDeployCSTClaim
} from '../deploys/liquidity_gauge_v3'
import {Client as CasperClient, Wallet} from "../wallet";
import BigNumber from "bignumber.js";
import {BlockchainAPI} from '../api/APIBlockchain'

export interface StakingResponsibilitiesProps {
    casperClient: CasperClient,
    wallet: Wallet
}

const client = new BlockchainAPI()
const StakingResponsibilities = ({casperClient, wallet}: StakingResponsibilitiesProps) => {
    // TODO Add params

    const onAddStake = (networkGasFeeStake: number, contractHash: string, amount: BigNumber) => {
        return signAndDeployDeposit(networkGasFeeStake, casperClient, wallet, contractHash, amount)
    }

    const onRemoveStake = (networkGasFee: number, contractHash: string, amount: BigNumber) => {
        return signAndDeployWithdraw(networkGasFee, casperClient, wallet, contractHash, amount)
    }

    const onClaimRewards = (gasFee, contractHash: string) => {
        return signAndDeployClaim(gasFee, casperClient, wallet, contractHash)
    }

    const onClaimCSTRewards = (gasFee, contractHash: string) => {
        return signAndDeployCSTClaim(gasFee, casperClient, wallet, contractHash)
    }

    const getBalance = (contractHash: string) => {
        return apiClient.getERC20Balance(wallet, contractHash)
    }

    const getStakeRewards = (accountHash: string, deployHash: string) => {
        return client.getRewards(accountHash, deployHash)
    }

    return {
        onAddStake,
        onRemoveStake,
        onClaimRewards,
        getBalance,
        onClaimCSTRewards,
        getStakeRewards
    }
}

export default StakingResponsibilities
