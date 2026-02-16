# frozen_string_literal: true

module Novabilling
  module Charges
    module Types
      class ListChargesRequest < Internal::Types::Model
        field :plan_id, -> { String }, optional: true, nullable: false, api_name: "planId"
      end
    end
  end
end
