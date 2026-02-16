# frozen_string_literal: true

module Novabilling
  module Taxes
    module Types
      class AssignToPlanTaxesRequest < Internal::Types::Model
        field :plan_id, -> { String }, optional: false, nullable: false, api_name: "planId"
        field :body, -> { Novabilling::Types::AssignTaxDto }, optional: false, nullable: false
      end
    end
  end
end
