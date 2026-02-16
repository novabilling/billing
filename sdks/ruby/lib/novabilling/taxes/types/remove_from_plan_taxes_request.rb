# frozen_string_literal: true

module Novabilling
  module Taxes
    module Types
      class RemoveFromPlanTaxesRequest < Internal::Types::Model
        field :plan_id, -> { String }, optional: false, nullable: false, api_name: "planId"
        field :tax_id, -> { String }, optional: false, nullable: false, api_name: "taxId"
      end
    end
  end
end
