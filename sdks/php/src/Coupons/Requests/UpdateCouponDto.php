<?php

namespace NovaBilling\Coupons\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class UpdateCouponDto extends JsonSerializableType
{
    /**
     * @var ?string $name
     */
    #[JsonProperty('name')]
    public ?string $name;

    /**
     * @var ?string $description
     */
    #[JsonProperty('description')]
    public ?string $description;

    /**
     * @var ?bool $isActive
     */
    #[JsonProperty('isActive')]
    public ?bool $isActive;

    /**
     * @var ?string $expiresAt
     */
    #[JsonProperty('expiresAt')]
    public ?string $expiresAt;

    /**
     * @param array{
     *   name?: ?string,
     *   description?: ?string,
     *   isActive?: ?bool,
     *   expiresAt?: ?string,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->name = $values['name'] ?? null;
        $this->description = $values['description'] ?? null;
        $this->isActive = $values['isActive'] ?? null;
        $this->expiresAt = $values['expiresAt'] ?? null;
    }
}
