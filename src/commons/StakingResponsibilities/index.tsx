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

    const onAddStake = (contractHash: string, amount: BigNumber) => {
        return signAndDeployDeposit(casperClient, wallet, contractHash, amount)
    }

    const onRemoveStake = (contractHash: string, amount: BigNumber) => {
        return signAndDeployWithdraw(casperClient, wallet, contractHash, amount)
    }

    const onClaimRewards = (contractHash: string) => {
        return signAndDeployClaim(casperClient, wallet, contractHash)
    }

    const onClaimCSTRewards = (contractHash: string) => {
        return signAndDeployCSTClaim(casperClient, wallet, contractHash)
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
