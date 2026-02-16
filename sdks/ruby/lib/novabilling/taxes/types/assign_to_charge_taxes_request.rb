# frozen_string_literal: true

module Novabilling
  module Taxes
    module Types
      class AssignToChargeTaxesRequest < Internal::Types::Model
        field :charge_id, -> { String }, optional: false, nullable: false, api_name: "chargeId"
        field :body, -> { Novabilling::Types::AssignTaxDto }, optional: false, nullable: false
      end
    end
  end
end
