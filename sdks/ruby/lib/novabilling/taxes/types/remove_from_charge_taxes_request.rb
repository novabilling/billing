# frozen_string_literal: true

module Novabilling
  module Taxes
    module Types
      class RemoveFromChargeTaxesRequest < Internal::Types::Model
        field :charge_id, -> { String }, optional: false, nullable: false, api_name: "chargeId"
        field :tax_id, -> { String }, optional: false, nullable: false, api_name: "taxId"
      end
    end
  end
end
