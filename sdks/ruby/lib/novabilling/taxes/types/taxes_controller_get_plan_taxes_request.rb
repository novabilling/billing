# frozen_string_literal: true

module Novabilling
  module Taxes
    module Types
      class TaxesControllerGetPlanTaxesRequest < Internal::Types::Model
        field :plan_id, -> { String }, optional: false, nullable: false, api_name: "planId"
      end
    end
  end
end
