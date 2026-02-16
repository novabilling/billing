<?php

namespace NovaBilling\Subscriptions\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class ChangePlanDto extends JsonSerializableType
{
    /**
     * @var string $newPlanId New plan ID
     */
    #[JsonProperty('newPlanId')]
    public string $newPlanId;

    /**
     * @var ?bool $prorate Whether to prorate charges
     */
    #[JsonProperty('prorate')]
    public ?bool $prorate;

    /**
     * @param array{
     *   newPlanId: string,
     *   prorate?: ?bool,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->newPlanId = $values['newPlanId'];
        $this->prorate = $values['prorate'] ?? null;
    }
}
