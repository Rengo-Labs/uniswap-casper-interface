import {apiClient} from "../../contexts/ConfigContext";
import {
    signAndDeployClaim,
    signAndDeployDeposit,
    signAndDeployWithdraw
} from '../deploys/liquidity_gauge_v3'
import {Client as CasperClient, Wallet} from "../wallet";
import BigNumber from "bignumber.js";

export interface StakingResponsibilitiesProps {
    casperClient: CasperClient,
    wallet: Wallet
}

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

    const getBalance = (contractHash: string) => {
        return apiClient.getERC20Balance(wallet, contractHash)
    }

    return {
        onAddStake,
        onRemoveStake,
        onClaimRewards,
        getBalance
    }
}

export default StakingResponsibilities
